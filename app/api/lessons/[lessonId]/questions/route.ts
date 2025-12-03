import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, DifficultyLevel } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@/auth';
import { getCachedChapterQuestions } from '@/lib/cache';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

/**
 * GET /api/lessons/[lessonId]/questions
 * 
 * Dynamically selects questions for a lesson session based on:
 * - Lesson's targetDifficulty and questionCount config
 * - Chapter's question pool
 * - User's question history (prioritize unseen/weak questions)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { lessonId } = await params;

    if (!lessonId) {
      return NextResponse.json(
        { message: 'lessonId is required' },
        { status: 400 }
      );
    }

    // Fetch lesson with unit and chapter info
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        unit: {
          include: {
            chapter: {
              include: {
                language: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { message: 'Lesson not found' },
        { status: 404 }
      );
    }

    const chapterId = lesson.unit.chapterId;
    const languageId = lesson.unit.chapter.languageId;
    const questionCount = lesson.questionCount;
    const targetDifficulty = lesson.targetDifficulty;

    // Map difficulty enum to priority order for selection
    const difficultyOrder: DifficultyLevel[] = [targetDifficulty];
    if (targetDifficulty === 'EASY') {
      difficultyOrder.push('MEDIUM', 'HARD');
    } else if (targetDifficulty === 'MEDIUM') {
      difficultyOrder.push('EASY', 'HARD');
    } else {
      difficultyOrder.push('MEDIUM', 'EASY');
    }

    // Fetch all questions for this chapter using cache
    const allQuestions = await getCachedChapterQuestions(chapterId, languageId);

    let selectedQuestions: typeof allQuestions = [];

    if (userId) {
      // Get user's question history for this chapter's questions
      const questionIds = allQuestions.map(q => q.id);
      const userHistory = await prisma.userQuestionHistory.findMany({
        where: {
          userId,
          questionId: { in: questionIds },
        },
      });

      const historyMap = new Map(userHistory.map(h => [h.questionId, h]));

      // Score each question for selection priority
      const scoredQuestions = allQuestions.map(q => {
        const history = historyMap.get(q.id);
        let score = 0;

        // Priority 1: Never seen questions (highest priority)
        if (!history) {
          score += 1000;
        } else {
          // Priority 2: Low mastery questions (weak areas)
          score += (1 - history.mastery) * 500;

          // Priority 3: Questions not seen recently
          const daysSinceLastSeen = Math.floor(
            (Date.now() - history.lastSeenAt.getTime()) / (1000 * 60 * 60 * 24)
          );
          score += Math.min(daysSinceLastSeen * 10, 200);
        }

        // Priority 4: Match target difficulty
        const difficultyIndex = difficultyOrder.indexOf(q.difficulty);
        score -= difficultyIndex * 50;

        return { question: q, score };
      });

      // Sort by score (highest first) and take required count
      scoredQuestions.sort((a, b) => b.score - a.score);
      selectedQuestions = scoredQuestions
        .slice(0, questionCount)
        .map(sq => sq.question);
    } else {
      // No user - just select by difficulty preference
      const sortedByDifficulty = [...allQuestions].sort((a, b) => {
        const aIndex = difficultyOrder.indexOf(a.difficulty);
        const bIndex = difficultyOrder.indexOf(b.difficulty);
        return aIndex - bIndex;
      });

      selectedQuestions = sortedByDifficulty.slice(0, questionCount);
    }

    // Shuffle selected questions for variety
    for (let i = selectedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]];
    }

    // Create lesson session if user is authenticated
    let sessionId: string | null = null;
    if (userId && selectedQuestions.length > 0) {
      const lessonSession = await prisma.lessonSession.create({
        data: {
          lessonId,
          userId,
          questionIds: selectedQuestions.map(q => q.id),
        },
      });
      sessionId = lessonSession.id;
    }

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        hearts: lesson.hearts,
        type: lesson.type,
        unit: lesson.unit,
      },
      questions: selectedQuestions,
      sessionId,
      questionCount: selectedQuestions.length,
    }, {
      headers: {
        // Cache for 10 minutes on client, 1 hour on CDN for authenticated users
        // Cache for 1 hour on CDN for anonymous users
        'Cache-Control': userId 
          ? 'private, max-age=600, s-maxage=3600'
          : 'public, max-age=600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching lesson questions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch lesson questions', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
