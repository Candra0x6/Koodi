import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import ChapterSetup from '@/components/chapter/ChapterSetup';

export default async function ChapterSetupPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Check if user completed onboarding
  const onboardingData = await prisma.onboardingData.findUnique({
    where: { userId: session.user.id },
    select: {
      completed: true,
      selectedCourse: true,
      knowledgeLevel: true,
    },
  });

  if (!onboardingData?.completed) {
    redirect('/onboarding');
  }

  // Get first chapter (or first unlocked chapter)
  const chapter = await prisma.chapter.findFirst({
    where: {},
    select: {
      id: true,
      title: true,
      description: true,
      order: true,
      units: {
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
          lessons: {
            select: {
              id: true,
              title: true,
              xpReward: true,
            },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  });

  if (!chapter) {
    redirect('/');
  }

  // Fetch user's progress on this chapter
  const userChapter = await prisma.userChapter.findUnique({
    where: {
      userId_chapterId: {
        userId: session.user.id,
        chapterId: chapter.id,
      },
    },
  });

  // Fetch user's progress on each unit
  const userUnits = await prisma.userUnit.findMany({
    where: {
      userId: session.user.id,
      unitId: { in: chapter.units.map((u) => u.id) },
    },
  });

  const userUnitsMap = new Map(userUnits.map((u) => [u.unitId, u]));

  // Enrich units with user progress
  const unitsWithProgress = chapter.units.map((unit, idx) => {
    const userUnit = userUnitsMap.get(unit.id);
    return {
      ...unit,
      description: unit.description || undefined,
      status: userUnit?.status || (idx === 0 ? 'unlocked' : 'locked'),
      xpEarned: userUnit?.xpEarned || 0,
      completed: userUnit?.status === 'completed',
    };
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-green-400 to-emerald-500 p-4">
      <ChapterSetup
        userId={session.user.id}
        chapter={{
          ...chapter,
          description: chapter.description || undefined,
        }}
        units={unitsWithProgress}
        chapterStatus={userChapter?.status || 'in_progress'}
      />
    </div>
  );
}
