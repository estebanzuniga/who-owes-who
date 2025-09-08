import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.headers.get('authorization')?.split(' ')[1];
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyAccessToken(accessToken);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Increment tokenVersion
    await prisma.user.update({
      where: { id: payload.userId },
      data: { tokenVersion: { increment: 1 } },
    });

    // Also clear cookies for refreshToken
    const res = NextResponse.json({ message: 'Logged out from all devices' });
    res.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
