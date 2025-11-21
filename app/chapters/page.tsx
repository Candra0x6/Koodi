import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import ChaptersDisplay from '@/components/chapters/ChaptersDisplay';

export default async function ChaptersPage() {
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

  // Fetch all chapters for the selected language/course
  const chapters = await prisma.chapter.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      order: true,
    },
    orderBy: { order: 'asc' },
  });

  // Fetch user progress for UI display
  const userProgress = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
    select: {
      lessonId: true,
      completed: true,
    },
  });

  // Fetch lessons with their units and chapters
  const lessons = await prisma.lesson.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      unit: {
        select: {
          id: true,
          title: true,
          chapterId: true,
        },
      },
      difficulty: true,
      xpReward: true,
    },
  });

  // Map lessons to chapters
  const chaptersWithLessons = chapters.map((chapter) => {
    const chapterLessons = lessons.filter(
      (lesson) => lesson.unit.chapterId === chapter.id
    );
    const completedLessons = chapterLessons.filter((lesson) =>
      userProgress.find((p) => p.lessonId === lesson.id && p.completed)
    );

    return {
      ...chapter,
      lessons: chapterLessons,
      completedCount: completedLessons.length,
      totalCount: chapterLessons.length,
    };
  });

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <ChaptersDisplay
        chapters={chaptersWithLessons as any}
        difficulty={onboardingData.knowledgeLevel}
      />
    </div>
  );
}
