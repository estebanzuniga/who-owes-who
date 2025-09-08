import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signAccessToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('refreshToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Missing refresh token' }, { status: 401 });
    }

    const payload = verifyRefreshToken(token);
    const accessToken = signAccessToken({ userId: payload.userId, email: payload.email, tokenVersion: payload.tokenVersion });

    return NextResponse.json({ accessToken });
  } catch {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
