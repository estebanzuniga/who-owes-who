import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export async function getUserFromToken(token?: string) {
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    // Token version check (for force logout everywhere)
    if (!user || user.tokenVersion !== payload.tokenVersion) return null;

    return user;
  } catch {
    return null;
  }
}
