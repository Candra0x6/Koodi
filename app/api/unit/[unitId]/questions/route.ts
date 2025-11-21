import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { unitId } = await params;
    const { searchParams } = new URL(request.url);
    const questionCount = parseInt(searchParams.get('count') || '5');

    // Fetch lessons for this unit
    const lessons = await prisma.lesson.findMany({
      where: { unitId },
      select: { id: true, questionIds: true, difficulty: true },
    });

    if (lessons.length === 0) {
      return NextResponse.json(
        { error: 'No lessons found for this unit' },
        { status: 404 }
      );
    }

    // Collect all question IDs from lessons
    const allQuestionIds = lessons.flatMap((lesson) => lesson.questionIds || []);

    // Fetch questions from database
    const questions = await prisma.question.findMany({
      where: {
        id: { in: allQuestionIds },
      },
      select: {
        id: true,
        prompt: true,
        codeSnippet: true,
        correctAnswer: true,
        explanation: true,
        difficulty: true,
        tags: true,
        questionType: true,
        choices: true,
      },
      take: questionCount,
    });

    // Shuffle and return random questions
    const shuffled = questions.sort(() => Math.random() - 0.5);

    return NextResponse.json({
      success: true,
      questions: shuffled.slice(0, questionCount),
      count: shuffled.length,
    });
  } catch (error) {
    console.error('Error fetching unit questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
