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
    const { questionId, selected, isCorrect, sessionId } = body;

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

    // Update user's question history for adaptive learning
    const existingHistory = await prisma.userQuestionHistory.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });

    if (existingHistory) {
      // Update existing history
      const newAttempts = existingHistory.attempts + 1;
      const newCorrect = existingHistory.correct + (isCorrect ? 1 : 0);
      // Calculate mastery as success rate with decay for old data
      const mastery = newCorrect / newAttempts;

      await prisma.userQuestionHistory.update({
        where: {
          userId_questionId: {
            userId,
            questionId,
          },
        },
        data: {
          attempts: newAttempts,
          correct: newCorrect,
          lastSeenAt: new Date(),
          mastery,
        },
      });
    } else {
      // Create new history entry
      await prisma.userQuestionHistory.create({
        data: {
          userId,
          questionId,
          attempts: 1,
          correct: isCorrect ? 1 : 0,
          lastSeenAt: new Date(),
          mastery: isCorrect ? 1 : 0,
        },
      });
    }

    // Update session hearts used if sessionId provided
    if (sessionId && !isCorrect) {
      await prisma.lessonSession.update({
        where: { id: sessionId },
        data: {
          heartsUsed: { increment: 1 },
        },
      });
    }

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
