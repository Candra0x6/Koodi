import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@/auth';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

/**
 * GET /api/questions
 * 
 * Fetch questions with optional filters:
 * - languageId: filter by language
 * - chapterId: filter by chapter
 * - difficulty: filter by difficulty level (EASY, MEDIUM, HARD)
 * - type: filter by question type
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const languageId = searchParams.get('languageId');
    const chapterId = searchParams.get('chapterId');
    const difficulty = searchParams.get('difficulty');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');

    // Build where clause based on filters
    const where: any = {};

    if (languageId) {
      where.languageId = languageId;
    }

    if (chapterId) {
      where.chapterId = chapterId;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (type) {
      where.type = type;
    }

    const questions = await prisma.question.findMany({
      where,
      include: {
        codeSegments: { orderBy: { index: 'asc' } },
        options: { orderBy: { index: 'asc' } },
        items: { orderBy: { index: 'asc' } },
        pairs: { orderBy: { index: 'asc' } },
        chapter: {
          select: { id: true, title: true },
        },
        language: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { id: 'asc' },
      ...(limit ? { take: parseInt(limit) } : {}),
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch questions', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/questions
 * 
 * Create a new question in the question pool
 */
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
    const {
      type,
      instruction,
      description,
      codeBlock,
      correctOrder,
      codeBefore,
      codeAfter,
      logicCondition,
      explanation,
      difficulty,
      languageId,
      chapterId,
      // Nested data
      codeSegments,
      options,
      items,
      pairs,
    } = body;

    // Validate required fields
    if (!type || !instruction || !languageId || !chapterId) {
      return NextResponse.json(
        { message: 'Missing required fields: type, instruction, languageId, chapterId' },
        { status: 400 }
      );
    }

    // Create question with nested relations
    const question = await prisma.question.create({
      data: {
        type,
        instruction,
        description,
        codeBlock,
        correctOrder: correctOrder || [],
        codeBefore,
        codeAfter,
        logicCondition,
        explanation,
        difficulty: difficulty || 'EASY',
        languageId,
        chapterId,
        // Create nested relations
        ...(codeSegments?.length > 0 && {
          codeSegments: {
            create: codeSegments.map((seg: any, index: number) => ({
              code: seg.code,
              isBug: seg.isBug,
              correction: seg.correction,
              index,
            })),
          },
        }),
        ...(options?.length > 0 && {
          options: {
            create: options.map((opt: any, index: number) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
              index,
            })),
          },
        }),
        ...(items?.length > 0 && {
          items: {
            create: items.map((item: any, index: number) => ({
              text: item.text,
              index,
            })),
          },
        }),
        ...(pairs?.length > 0 && {
          pairs: {
            create: pairs.map((pair: any, index: number) => ({
              text: pair.text,
              matchId: pair.matchId,
              index,
            })),
          },
        }),
      },
      include: {
        codeSegments: true,
        options: true,
        items: true,
        pairs: true,
      },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { message: 'Failed to create question', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
