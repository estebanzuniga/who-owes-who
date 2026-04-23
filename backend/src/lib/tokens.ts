import jwt from 'jsonwebtoken';
import { type Response } from 'express';
import { env } from './env.js';
import ms from 'ms';

export function signAccessToken(userId: string, email: string): string {
    return jwt.sign(
        { id: userId, email },
        env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: env.ACCES_TOKEN_EXPIRY as ms.StringValue }
    );
}

export function signRefreshToken(userId: string): string {
  return jwt.sign(
    { id: userId },
    env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRY as ms.StringValue }
  );
}

export function setTokenCookie(res: Response, accesToken: string, refreshToken: string): void {
  const isProduction = env.NODE_ENV === 'production';
  const base = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
  }

  res.cookie('access_token', accesToken, {
    ...base,
    maxAge: ms(env.ACCES_TOKEN_EXPIRY as ms.StringValue),
  });
  res.cookie('refresh_token', refreshToken, {
    ...base,
    maxAge: ms(env.REFRESH_TOKEN_EXPIRY as ms.StringValue),
  });
}