import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ message: 'Logged out' });
  res.cookies.set('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
