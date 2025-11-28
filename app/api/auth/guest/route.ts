import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomBytes } from 'crypto';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

/**
 * Generate a random guest username like "Guest_7f3a2b"
 */
function generateGuestUsername(): string {
  const randomId = randomBytes(3).toString('hex');
  return `Guest_${randomId}`;
}

export async function POST() {
  try {
    // Generate unique guest username
    let username = generateGuestUsername();
    
    // Ensure username is unique (retry if collision)
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.user.findUnique({
        where: { username },
      });
      if (!existing) break;
      username = generateGuestUsername();
      attempts++;
    }

    // Create guest user (no email, no password)
    const guestUser = await prisma.user.create({
      data: {
        username,
        isGuest: true,
      },
    });

    return NextResponse.json({
      success: true,
      userId: guestUser.id,
      username: guestUser.username,
    });
  } catch (error) {
    console.error('Guest user creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create guest user', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
