import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { signAccessToken, signRefreshToken, setTokenCookies } from '../lib/tokens.js'
import { authMiddleware } from '../middleware/auth.js'
import { tryCatch } from '../lib/tryCatch.js'
import { env } from '../lib/env.js'
import ms from 'ms';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

authRouter.post('/register', tryCatch(async (req, res) => {
	console.log('Registering user');
  const { email, password, name } = registerSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    res.status(400).json({ message: 'Email already in use' });
		return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name, passwordHash },
  })

  res.status(201).json({ id: user.id, email: user.email, name: user.name });  
}));

authRouter.post('/login', tryCatch(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ message: 'Invalid credentials' });
		return;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
	if (!isValid) {
		res.status(400).json({ message: 'Invalid credentials' });
		return;
	}

	const accessToken = signAccessToken(user.id, user.email);
	const refreshToken = signRefreshToken(user.id);

	await prisma.refreshToken.create({
		data: {
			token: refreshToken,
			userId: user.id,
			expiresAt: new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRY as ms.StringValue)),
		}
	});

	setTokenCookies(res, accessToken, refreshToken);
	console.log('User logged in:', user.email);
	res.json({ id: user.id, email: user.email, name: user.name });
}));

authRouter.post('/refresh', tryCatch(async (req, res) => {
	const refreshToken = req.cookies.refreshToken as string | undefined;
	if (!refreshToken) {
		res.status(401).json({ message: 'No refresh token provided' });
		return;
	}

	const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
	if (!storedToken || storedToken.expiresAt < new Date()) {
		res.status(401).json({ message: 'Invalid or expired refresh token' });
		return;
	}

	let payload: { id: string; email?: string };
	try {
		payload = jwt.verify(refreshToken, env.JWT_REFRESH_TOKEN_SECRET) as { id: string; email?: string };
	} catch (err) {
		res.status(401).json({ message: 'Invalid refresh token' });
		return;
	}

	const user = await prisma.user.findUniqueOrThrow({ where: { id: payload.id } });
	const newAccessToken = signAccessToken(user.id, user.email);
	res.cookie('accessToken', newAccessToken, {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: ms(env.ACCES_TOKEN_EXPIRY as ms.StringValue),
	});
	res.json({ ok: true });
}));

authRouter.post('/logout', authMiddleware, tryCatch(async (req, res) => {
	const refreshToken = req.cookies.refreshToken as string | undefined;
	if (refreshToken) {
		await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
	}

	res.clearCookie('accessToken');
	res.clearCookie('refreshToken');
	res.json({ ok: true });
}));

authRouter.get('/profile', authMiddleware, tryCatch(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: { id: req.user.id },
		select: { id: true, email: true, name: true },
	});
	res.json(user);
}));