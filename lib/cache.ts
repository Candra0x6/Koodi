import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma/client";

// Cache configuration constants (in seconds)
const CACHE_TTL = {
  CHAPTERS: 2 * 60 * 60, // 2 hours for static chapter structure
  LESSONS: 2 * 60 * 60, // 2 hours for lesson data
  QUESTIONS: 2 * 60 * 60, // 2 hours for questions (static content)
  USER_PROFILE: 5 * 60, // 5 minutes for user profile (real-time updates)
} as const;

/**
 * Cached query for fetching chapters with units and lessons
 * Revalidates every 2 hours
 */
export const getCachedChapters = unstable_cache(
  async (languageId: string) => {
    return await prisma.chapter.findMany({
      where: { languageId },
      orderBy: { levelIndex: "asc" },
      include: {
        units: {
          orderBy: { unitIndex: "asc" },
          include: {
            lessons: {
              orderBy: { lessonIndex: "asc" },
            },
          },
        },
        _count: {
          select: { questions: true },
        },
      },
    });
  },
  ["chapters"],
  { revalidate: CACHE_TTL.CHAPTERS }
);

/**
 * Cached query for fetching user progress data
 * Revalidates every 5 minutes for real-time updates
 */
export const getCachedUserProgress = unstable_cache(
  async (userId: string, unitIds: string[], lessonIds: string[]) => {
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

    return { userUnitsProgress, userLessonsCompletion };
  },
  ["user-progress"],
  { revalidate: CACHE_TTL.USER_PROFILE }
);

/**
 * Cached query for fetching user profile
 * Revalidates every 5 minutes for real-time updates
 */
export const getCachedUserProfile = unstable_cache(
  async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        xp: true,
        gems: true,
        hearts: true,
        streak: true,
        longestStreak: true,
        languageProgresses: {
          where: { isActive: true },
          select: {
            id: true,
            languageId: true,
            language: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          take: 1,
        },
      },
    });
  },
  ["user-profile"],
  { revalidate: CACHE_TTL.USER_PROFILE }
);

/**
 * Cached query for fetching all questions for a chapter
 * Revalidates every 2 hours (questions are static content)
 * Used by lesson question selection API
 */
export const getCachedChapterQuestions = unstable_cache(
  async (chapterId: string, languageId: string) => {
    return await prisma.question.findMany({
      where: {
        chapterId,
        languageId,
      },
      include: {
        codeSegments: {
          orderBy: { index: "asc" },
        },
        options: {
          orderBy: { index: "asc" },
        },
        items: {
          orderBy: { index: "asc" },
        },
        pairs: {
          orderBy: { index: "asc" },
        },
      },
    });
  },
  ["chapter-questions"],
  { revalidate: CACHE_TTL.QUESTIONS }
);

