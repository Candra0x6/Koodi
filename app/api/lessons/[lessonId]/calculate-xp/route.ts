import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@/auth';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Map difficulty enum to numeric value for XP calculation
const difficultyValue = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
};

/**
 * Calculate XP earned for a lesson completion
 * Base XP = 10 + (difficulty × 5)
 * Streak multiplier: 1x base, 1.25x (3+ days), 1.5x (7+ days), 2x (14+ days)
 */
export async function POST(
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

    // Get lesson with targetDifficulty
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        targetDifficulty: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { message: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Use lesson's target difficulty for XP calculation
    const avgDifficulty = difficultyValue[lesson.targetDifficulty] || 1;

    // Get user's current streak
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true, lastStreakDate: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate streak multiplier
    let streakMultiplier = 1;
    if (user.streak >= 14) {
      streakMultiplier = 2;
    } else if (user.streak >= 7) {
      streakMultiplier = 1.5;
    } else if (user.streak >= 3) {
      streakMultiplier = 1.25;
    }

    // Base XP = 10 + (difficulty × 5)
    const baseXP = 10 + avgDifficulty * 5;
    const xpEarned = Math.round(baseXP * streakMultiplier);

    return NextResponse.json({
      xpEarned,
      baseXP,
      difficulty: avgDifficulty,
      streakMultiplier,
      currentStreak: user.streak,
    });
  } catch (error) {
    console.error('Error calculating XP:', error);
    return NextResponse.json(
      { message: 'Failed to calculate XP', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
