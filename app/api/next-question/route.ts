import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { pickNextQuestion } from '@/lib/adaptive-engine';
import { prisma } from '@/lib/prisma/client';

/**
 * GET /api/next-question
 * Fetch the next adaptive question for the user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Ensure user has mastery level initialized
    const exists = await prisma.masteryLevel.findFirst({
      where: { userId },
    });

    if (!exists) {
      await prisma.masteryLevel.create({
        data: {
          userId,
          skillId: 'general',
          eloRating: 1200,
        },
      });
    }

    // Get next question
    const question = await pickNextQuestion(userId);

    if (!question) {
      return NextResponse.json(
        { error: 'No questions available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: question.id,
        prompt: question.prompt,
        codeSnippet: question.codeSnippet,
        questionType: question.questionType,
        difficulty: question.difficulty,
        tags: question.tags,
      },
    });
  } catch (error) {
    console.error('Error fetching next question:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
