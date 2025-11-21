import { prisma } from '@/lib/prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: { order: 'asc' },
      include: {
        units: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                description: true,
                order: true,
                difficulty: true,
                xpReward: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapters' },
      { status: 500 }
    );
  }
}
