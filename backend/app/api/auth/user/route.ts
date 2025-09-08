import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { verifyAccessToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  console.log("Getting user information");
  try {
    const accessToken = req.headers.get('authorization')?.split(' ')[1];
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyAccessToken(accessToken);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    return NextResponse.json({ data: user, message: 'User information retrieved successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
