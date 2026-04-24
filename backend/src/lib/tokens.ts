import jwt from 'jsonwebtoken';
import { type Response } from 'express';
import { env } from './env.js';
import ms from 'ms';

export function signAccessToken(userId: string, email: string): string {
    return jwt.sign(
        { id: userId, email },
        env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: env.ACCESS_TOKEN_EXPIRY as ms.StringValue }
    );
}

export function signRefreshToken(userId: string): string {
  return jwt.sign(
    { id: userId },
    env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRY as ms.StringValue }
  );
}

export function setTokenCookies(res: Response, accesToken: string, refreshToken: string): void {
  const isProduction = env.NODE_ENV === 'production';
  const base = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
  };

  res.cookie('accessToken', accesToken, {
    ...base,
    maxAge: ms(env.ACCESS_TOKEN_EXPIRY as ms.StringValue),
  });
  res.cookie('refreshToken', refreshToken, {
    ...base,
    maxAge: ms(env.REFRESH_TOKEN_EXPIRY as ms.StringValue),
  });
}