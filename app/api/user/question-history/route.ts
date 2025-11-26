import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@/auth';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

/**
 * GET /api/user/question-history
 * 
 * Fetch user's question history with optional filters
 * - chapterId: filter by chapter
 * - languageId: filter by language
 * - minMastery: filter by minimum mastery level (0-1)
 * - maxMastery: filter by maximum mastery level (0-1)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

  if (!userId) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const chapterId = searchParams.get('chapterId');
    const languageId = searchParams.get('languageId');
    const minMastery = searchParams.get('minMastery');
    const maxMastery = searchParams.get('maxMastery');
    const limit = searchParams.get('limit');

    // Build where clause
    const where: any = { userId };

    // Filter by mastery levels
    if (minMastery !== null || maxMastery !== null) {
      where.mastery = {};
      if (minMastery !== null) {
        where.mastery.gte = parseFloat(minMastery);
      }
      if (maxMastery !== null) {
        where.mastery.lte = parseFloat(maxMastery);
      }
    }

    // Filter by chapter or language (through question relation)
    if (chapterId || languageId) {
      where.question = {};
      if (chapterId) {
        where.question.chapterId = chapterId;
      }
      if (languageId) {
        where.question.languageId = languageId;
      }
    }

    const history = await prisma.userQuestionHistory.findMany({
      where,
      include: {
        question: {
          select: {
            id: true,
            type: true,
            instruction: true,
            difficulty: true,
            chapterId: true,
            languageId: true,
            chapter: {
              select: { id: true, title: true },
            },
            language: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
      orderBy: { lastSeenAt: 'desc' },
      ...(limit ? { take: parseInt(limit) } : {}),
    });

    // Calculate summary stats
    const totalQuestions = history.length;
    const avgMastery = totalQuestions > 0
      ? history.reduce((sum, h) => sum + h.mastery, 0) / totalQuestions
      : 0;
    const weakQuestions = history.filter(h => h.mastery < 0.5).length;
    const masteredQuestions = history.filter(h => h.mastery >= 0.8).length;

    return NextResponse.json({
      history,
      stats: {
        totalQuestions,
        avgMastery: Math.round(avgMastery * 100) / 100,
        weakQuestions,
        masteredQuestions,
      },
    });
  } catch (error) {
    console.error('Error fetching question history:', error);
    return NextResponse.json(
      { message: 'Failed to fetch question history', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
