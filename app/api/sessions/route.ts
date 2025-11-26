import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@/auth';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

/**
 * GET /api/sessions
 * 
 * Fetch user's lesson sessions with optional filters
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
    const lessonId = searchParams.get('lessonId');
    const completed = searchParams.get('completed');
    const limit = searchParams.get('limit');

    // Build where clause
    const where: any = { userId };

    if (lessonId) {
      where.lessonId = lessonId;
    }

    if (completed !== null) {
      if (completed === 'true') {
        where.completedAt = { not: null };
      } else if (completed === 'false') {
        where.completedAt = null;
      }
    }

    const sessions = await prisma.lessonSession.findMany({
      where,
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            type: true,
            unit: {
              select: {
                id: true,
                title: true,
                chapter: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { startedAt: 'desc' },
      ...(limit ? { take: parseInt(limit) } : {}),
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch sessions', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
