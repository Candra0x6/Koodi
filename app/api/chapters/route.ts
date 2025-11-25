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

    const searchParams = request.nextUrl.searchParams;
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { message: 'languageId is required' },
        { status: 400 }
      );
    }

    // Fetch all chapters for the language with units and lessons
    const chapters = await prisma.chapter.findMany({
      where: { languageId },
      orderBy: { levelIndex: 'asc' },
      include: {
        units: {
          orderBy: { unitIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { lessonIndex: 'asc' },
              include: {
                questions: {
                  select: { id: true, type: true },
                },
              },
            },
          },
        },
      },
    });

    // If no chapters found, return empty
    if (chapters.length === 0) {
      return NextResponse.json({ chapters: [] });
    }

    // Enrich with user progress data if logged in
    if (userId) {
      // Collect all unit and lesson IDs
      const unitIds = chapters.flatMap(ch => ch.units.map(u => u.id));
      const lessonIds = chapters.flatMap(ch => 
        ch.units.flatMap(u => u.lessons.map(l => l.id))
      );

      // Batch fetch all user progress data in 2 queries instead of many
      const [userUnitsProgress, userLessonsCompletion] = await Promise.all([
        prisma.userUnitProgress.findMany({
          where: {
            userId,
            unitId: { in: unitIds },
          },
        }),
        prisma.userLessonCompletion.findMany({
          where: {
            userId,
            lessonId: { in: lessonIds },
          },
        }),
      ]);

      // Create maps for O(1) lookup
      const userProgressMap = new Map(
        userUnitsProgress.map(up => [
          up.unitId,
          {
            isUnlocked: up.isUnlocked,
            completed: up.completed,
            progress: up.progress,
          },
        ])
      );

      const userLessonCompletionMap = new Map(
        userLessonsCompletion.map(lc => [
          lc.lessonId,
          { completed: lc.completed },
        ])
      );

      // Enrich chapters with progress
      chapters.forEach((chapter) => {
        chapter.units.forEach((unit: any) => {
          unit.userProgress = userProgressMap.get(unit.id) || {
            isUnlocked: false,
            completed: false,
            progress: 0,
          };

          unit.lessons.forEach((lesson: any) => {
            lesson.userCompletion = userLessonCompletionMap.get(lesson.id) || {
              completed: false,
            };
          });
        });
      });
    }

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { message: 'Failed to fetch chapters', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
