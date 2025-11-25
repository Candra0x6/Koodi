import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@/auth';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { unitId } = body;

    if (!unitId) {
      return NextResponse.json(
        { message: 'unitId is required' },
        { status: 400 }
      );
    }

    // Get the unit with its chapter
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        chapter: true,
      },
    });

    if (!unit) {
      return NextResponse.json(
        { message: 'Unit not found' },
        { status: 404 }
      );
    }

    // Get all units in this chapter ordered by unitIndex
    const allUnitsInChapter = await prisma.unit.findMany({
      where: { chapterId: unit.chapterId },
      orderBy: { unitIndex: 'asc' },
    });

    // Find this unit's index
    const currentUnitIndex = allUnitsInChapter.findIndex((u) => u.id === unitId);

    if (currentUnitIndex === 0) {
      // First unit in chapter, can be unlocked
      return NextResponse.json({ canUnlock: true });
    }

    // Check if previous unit is completed
    const previousUnit = allUnitsInChapter[currentUnitIndex - 1];
    const previousProgress = await prisma.userUnitProgress.findUnique({
      where: {
        userId_unitId: {
          userId,
          unitId: previousUnit.id,
        },
      },
    });

    const canUnlock = previousProgress?.completed === true;

    return NextResponse.json({ canUnlock });
  } catch (error) {
    console.error('Error checking unit unlock:', error);
    return NextResponse.json(
      { message: 'Failed to check unit unlock', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
