import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { processAnswerSubmission } from '@/lib/adaptive-engine';
import { prisma } from '@/lib/prisma/client';

export const dynamic = 'force-dynamic';

/**
 * POST /api/submit-answer
 * Submit an answer to a question and update user ability
 * Body: { questionId: string, isCorrect: boolean, timeSpent: number }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { questionId, isCorrect, timeSpent } = body;

    // Validate input
    if (!questionId || typeof isCorrect !== 'boolean' || typeof timeSpent !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Verify question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Record the attempt
    await prisma.questionAttempt.create({
      data: {
        userId,
        questionId,
        userAnswer: { submitted: true },
        isCorrect,
        timeSpent,
        attemptNumber: 1,
        xpEarned: isCorrect ? 10 : 0,
      },
    });

    // Process the submission and update ability
    const result = await processAnswerSubmission(
      userId,
      questionId,
      isCorrect,
      timeSpent
    );

    // Calculate XP bonus based on time efficiency
    let xpBonus = 0;
    if (isCorrect) {
      if (timeSpent < 60) xpBonus = 5; // Quick answer bonus
      if (timeSpent < 30) xpBonus = 10; // Very quick bonus
    }

    return NextResponse.json({
      success: true,
      data: {
        isCorrect,
        xpEarned: result.xpEarned + xpBonus,
        userElo: result.userElo,
        questionDifficulty: result.questionDifficulty,
        message: isCorrect ? 'Correct! Great job!' : 'Incorrect. Keep practicing!',
      },
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
