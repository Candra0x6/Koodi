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
    const { lessonId, sessionId } = body;

    if (!lessonId) {
      return NextResponse.json(
        { message: 'lessonId is required' },
        { status: 400 }
      );
    }

    // Get lesson with unit info
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        unitId: true,
        targetDifficulty: true,
        unit: {
          select: {
            id: true,
            _count: {
              select: { lessons: true },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { message: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Mark lesson as completed
    const userLesson = await prisma.userLessonCompletion.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
        hearts: 3,
        attempts: 0,
      },
    });

    // Calculate XP based on lesson's target difficulty
    const avgDifficulty = difficultyValue[lesson.targetDifficulty] || 1;

    // Get user for streak calculation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true, lastStreakDate: true },
    });

    // Check if streak should continue (completed today or yesterday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = user?.lastStreakDate
      ? new Date(user.lastStreakDate)
      : null;
    lastDate?.setHours(0, 0, 0, 0);

    const timeDiff = lastDate ? today.getTime() - lastDate.getTime() : -1;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    let newStreak = user?.streak || 0;
    if (daysDiff > 1) {
      // Streak broken, restart
      newStreak = 1;
    } else if (daysDiff === 0) {
      // Already completed today, keep streak
      newStreak = user?.streak || 1;
    } else {
      // New day, increment streak
      newStreak = (user?.streak || 0) + 1;
    }

    // Calculate streak multiplier
    let streakMultiplier = 1;
    if (newStreak >= 14) {
      streakMultiplier = 2;
    } else if (newStreak >= 7) {
      streakMultiplier = 1.5;
    } else if (newStreak >= 3) {
      streakMultiplier = 1.25;
    }

    // Base XP = 10 + (difficulty × 5)
    const baseXP = 10 + avgDifficulty * 5;
    const xpEarned = Math.round(baseXP * streakMultiplier);

    // Update user with streak and XP
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xpEarned },
        streak: newStreak,
        lastStreakDate: new Date(),
      },
    });

    // Update lesson completion with XP earned
    await prisma.userLessonCompletion.update({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      data: {
        xpEarned,
      },
    });

    // Mark lesson session as completed if sessionId provided
    if (sessionId) {
      await prisma.lessonSession.update({
        where: { id: sessionId },
        data: {
          completedAt: new Date(),
          xpEarned,
        },
      });
    }

    // Calculate unit progress: completed lessons / total lessons
    const unitId = lesson.unitId;
    const totalLessons = lesson.unit._count.lessons;

    // Count completed lessons for this unit
    const completedLessons = await prisma.userLessonCompletion.count({
      where: {
        userId,
        lesson: {
          unitId,
        },
        completed: true,
      },
    });

    const progress = Math.round((completedLessons / totalLessons) * 100);

    // Update unit progress
    await prisma.userUnitProgress.update({
      where: {
        userId_unitId: {
          userId,
          unitId,
        },
      },
      data: {
        progress,
        // If all lessons completed, mark unit as completed
        completed: progress === 100,
      },
    });

    // If unit is now completed, unlock next unit in same chapter
    if (progress === 100) {
      const currentUnit = await prisma.unit.findUnique({
        where: { id: unitId },
        select: {
          id: true,
          unitIndex: true,
          chapterId: true,
          chapter: {
            select: {
              _count: {
                select: { units: true },
              },
            },
          },
        },
      });

      if (currentUnit) {
        const nextUnitIndex = currentUnit.unitIndex + 1;
        const nextUnit = await prisma.unit.findFirst({
          where: {
            chapterId: currentUnit.chapterId,
            unitIndex: nextUnitIndex,
          },
          select: { id: true },
        });

        if (nextUnit) {
          // Unlock next unit
          await prisma.userUnitProgress.update({
            where: {
              userId_unitId: {
                userId,
                unitId: nextUnit.id,
              },
            },
            data: {
              isUnlocked: true,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      lesson: userLesson,
      unitProgress: progress,
      unitCompleted: progress === 100,
      xpEarned,
      streak: newStreak,
      streakMultiplier,
      totalXP: updatedUser.xp,
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    return NextResponse.json(
      { message: 'Failed to complete lesson', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
