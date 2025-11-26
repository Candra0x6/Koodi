import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@/auth';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

/**
 * GET /api/sessions/[sessionId]
 * 
 * Fetch a single session with its questions
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { message: 'sessionId is required' },
        { status: 400 }
      );
    }

    const lessonSession = await prisma.lessonSession.findUnique({
      where: { id: sessionId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            type: true,
            hearts: true,
            unit: {
              select: {
                id: true,
                title: true,
                chapter: {
                  select: {
                    id: true,
                    title: true,
                    language: {
                      select: {
                        id: true,
                        name: true,
                        slug: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lessonSession) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      );
    }

    // Verify the session belongs to the user
    if (lessonSession.userId !== userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Fetch the questions for this session
    const questions = await prisma.question.findMany({
      where: {
        id: { in: lessonSession.questionIds },
      },
      include: {
        codeSegments: { orderBy: { index: 'asc' } },
        options: { orderBy: { index: 'asc' } },
        items: { orderBy: { index: 'asc' } },
        pairs: { orderBy: { index: 'asc' } },
      },
    });

    // Sort questions to match the order in questionIds
    const orderedQuestions = lessonSession.questionIds
      .map(id => questions.find(q => q.id === id))
      .filter(Boolean);

    return NextResponse.json({
      session: lessonSession,
      questions: orderedQuestions,
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { message: 'Failed to fetch session', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/sessions/[sessionId]
 * 
 * Update session (e.g., mark as completed, update hearts used)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const authSession = await auth();
    const userId = authSession?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { message: 'sessionId is required' },
        { status: 400 }
      );
    }

    // Verify session exists and belongs to user
    const existingSession = await prisma.lessonSession.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      );
    }

    if (existingSession.userId !== userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { heartsUsed, xpEarned, completedAt } = body;

    const updatedSession = await prisma.lessonSession.update({
      where: { id: sessionId },
      data: {
        ...(heartsUsed !== undefined && { heartsUsed }),
        ...(xpEarned !== undefined && { xpEarned }),
        ...(completedAt !== undefined && { completedAt: completedAt ? new Date(completedAt) : null }),
      },
    });

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { message: 'Failed to update session', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
