import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    if (!lessonId) {
      return NextResponse.json(
        { message: 'lessonId is required' },
        { status: 400 }
      );
    }

    // Fetch lesson with all questions and nested relations
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        questions: {
          orderBy: { id: 'asc' },
          include: {
            codeSegments: {
              orderBy: { index: 'asc' },
            },
            options: {
              orderBy: { index: 'asc' },
            },
            items: {
              orderBy: { index: 'asc' },
            },
            pairs: {
              orderBy: { index: 'asc' },
            },
          },
        },
        unit: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { message: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lesson });
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
