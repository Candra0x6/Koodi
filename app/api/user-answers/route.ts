import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@/auth';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { questionId, selected, isCorrect, lessonId } = body;

    if (!questionId || selected === undefined || isCorrect === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save user answer
    await prisma.userAnswer.create({
      data: {
        userId,
        questionId,
        selected,
        isCorrect,
      },
    });

    // Note: Hearts are only tracked in frontend state, not persisted to database
    // This allows multiple retry attempts without consuming database hearts
    
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json(
      { message: 'Failed to save answer', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
