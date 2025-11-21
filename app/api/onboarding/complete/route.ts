import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      userId,
      selectedLanguage,
      difficulty,
      hearAbout,
      hearAboutOther,
      learningReason,
      learningReasonOther,
      goals,
      dailyGoal,
    } = body;

    if (!selectedLanguage || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update or create OnboardingData
    const onboardingData = await prisma.onboardingData.upsert({
      where: { userId },
      update: {
        selectedCourse: selectedLanguage,
        knowledgeLevel: difficulty,
        hearAbout,
        hearAboutOther,
        learningReason,
        learningReasonOther,
        goals,
        dailyGoal,
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        selectedCourse: selectedLanguage,
        knowledgeLevel: difficulty,
        hearAbout,
        hearAboutOther,
        learningReason,
        learningReasonOther,
        goals,
        dailyGoal,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Map difficulty to level
    const difficultyMap: Record<string, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    };
    const difficultyLevel = difficultyMap[difficulty.toLowerCase()] || 1;

    // Get the game type (language)
    const gameType = await prisma.gameType.findUnique({
      where: { id: selectedLanguage },
    });

    if (!gameType) {
      return NextResponse.json({ error: 'Language not found' }, { status: 400 });
    }

    // Fetch all questions for this game type with matching difficulty range
    const questions = await prisma.question.findMany({
      where: {
        gameTypeId: selectedLanguage,
        difficulty: {
          gte: Math.max(1, difficultyLevel - 1),
          lte: difficultyLevel + 1,
        },
      },
      select: { id: true, unitId: true },
      take: 100,
    });

    // Get unique units from questions
    const uniqueUnitIds = [...new Set(questions.map((q) => q.unitId).filter(Boolean))];

    // Fetch lessons in these units
    const lessons = await prisma.lesson.findMany({
      where: {
        unit: {
          id: { in: uniqueUnitIds as string[] },
        },
      },
      select: { id: true, unitId: true },
    });

    // Create UserProgress for all lessons
    if (lessons.length > 0) {
      await prisma.userProgress.createMany({
        data: lessons.map((lesson) => ({
          userId,
          lessonId: lesson.id,
          completed: false,
          attempts: 0,
        })),
        skipDuplicates: true,
      });
    }

    // Create MasteryLevel records for skills
    if (questions.length > 0) {
      const eloRatings: Record<number, number> = {
        1: 1000,
        2: 1200,
        3: 1400,
      };

      for (const question of questions.slice(0, 10)) {
        await prisma.masteryLevel.upsert({
          where: {
            userId_skillId: {
              userId,
              skillId: question.id,
            },
          },
          update: {
            currentLevel: difficultyLevel,
            eloRating: eloRatings[difficultyLevel],
          },
          create: {
            userId,
            skillId: question.id,
            status: 'in_progress',
            currentLevel: difficultyLevel,
            eloRating: eloRatings[difficultyLevel],
          },
        });
      }
    }

    // Create UserStats if not exists
    await prisma.userStats.upsert({
      where: { userId },
      update: {
        lastActiveDate: new Date(),
      },
      create: {
        userId,
        xp: 0,
        level: 1,
        hearts: 5,
        maxHearts: 5,
        lastActiveDate: new Date(),
      },
    });

    // Create UserChapter records for all chapters
    const chapters = await prisma.chapter.findMany({
      select: { id: true },
      orderBy: { order: 'asc' },
    });

    if (chapters.length > 0) {
      // First chapter should be 'in_progress', rest should be 'locked'
      await prisma.userChapter.createMany({
        data: chapters.map((chapter, idx) => ({
          userId,
          chapterId: chapter.id,
          status: idx === 0 ? 'in_progress' : 'locked',
          xpEarned: 0,
          startedAt: idx === 0 ? new Date() : null,
        })),
        skipDuplicates: true,
      });

      // Create UserUnit records for all units in all chapters
      const units = await prisma.unit.findMany({
        select: { id: true, order: true, chapterId: true },
      });

      if (units.length > 0) {
        await prisma.userUnit.createMany({
          data: units.map((unit) => {
            // Determine if unit is unlocked or locked based on chapter and unit order
            const chapter = chapters.find((c) => c.id === unit.chapterId);
            const isFirstChapter = chapter?.id === chapters[0]?.id;
            const isFirstUnit = isFirstChapter && unit.order === 1;

            return {
              userId,
              unitId: unit.id,
              status: isFirstUnit ? 'unlocked' : 'locked',
              xpEarned: 0,
              score: 0,
              attempts: 0,
              startedAt: isFirstUnit ? new Date() : null,
            };
          }),
          skipDuplicates: true,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      data: onboardingData,
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
