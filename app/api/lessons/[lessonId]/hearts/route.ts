import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@/auth';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
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

    const { lessonId } = await params;

    // Get lesson with hearts
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, hearts: true },
    });

    if (!lesson) {
      return NextResponse.json(
        { message: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Get or create user lesson completion
    let userLesson = await prisma.userLessonCompletion.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    if (!userLesson) {
      // Create new lesson session with full hearts
      userLesson = await prisma.userLessonCompletion.create({
        data: {
          userId,
          lessonId,
          hearts: lesson.hearts,
          attempts: 0,
          completed: false,
        },
      });
    }

    return NextResponse.json({
      hearts: userLesson.hearts,
      attempts: userLesson.attempts,
      completed: userLesson.completed,
    });
  } catch (error) {
    console.error('Error initializing hearts:', error);
    return NextResponse.json(
      { message: 'Failed to initialize hearts', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
