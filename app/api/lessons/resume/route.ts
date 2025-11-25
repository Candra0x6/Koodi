import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@/auth';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { message: 'languageId is required' },
        { status: 400 }
      );
    }

    // Get user's selected language progress
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get all chapters, units, and lessons for this language
    const chapters = await prisma.chapter.findMany({
      where: { languageId },
      orderBy: { levelIndex: 'asc' },
      include: {
        units: {
          orderBy: { unitIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { lessonIndex: 'asc' },
            },
          },
        },
      },
    });

    if (chapters.length === 0) {
      return NextResponse.json({
        lesson: null,
        unit: null,
        chapter: null,
      });
    }

    // Find first uncompleted lesson
    for (const chapter of chapters) {
      for (const unit of chapter.units) {
        for (const lesson of unit.lessons) {
          const completion = await prisma.userLessonCompletion.findUnique({
            where: {
              userId_lessonId: {
                userId,
                lessonId: lesson.id,
              },
            },
          });

          if (!completion || !completion.completed) {
            return NextResponse.json({
              lesson,
              unit,
              chapter,
            });
          }
        }
      }
    }

    // All lessons completed, return null
    return NextResponse.json({
      lesson: null,
      unit: null,
      chapter: null,
    });
  } catch (error) {
    console.error('Error finding resume lesson:', error);
    return NextResponse.json(
      { message: 'Failed to find resume lesson', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
