import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCachedChapters, getCachedUserProgress } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const searchParams = request.nextUrl.searchParams;
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { message: 'languageId is required' },
        { status: 400 }
      );
    }

    // Fetch chapters from cache (revalidates every 2 hours)
    const chapters = await getCachedChapters(languageId);

    // If no chapters found, return empty
    if (chapters.length === 0) {
      const response = NextResponse.json({ chapters: [] });
      response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600'); // CDN: 1 hour
      return response;
    }

    // Enrich with user progress data if logged in (cached for 5 minutes)
    if (userId) {
      const unitIds = chapters.flatMap(ch => ch.units.map(u => u.id));
      const lessonIds = chapters.flatMap(ch => 
        ch.units.flatMap(u => u.lessons.map(l => l.id))
      );

      const { userUnitsProgress, userLessonsCompletion } = await getCachedUserProgress(
        userId,
        unitIds,
        lessonIds
      );

      // Create maps for O(1) lookup
      const userProgressMap = new Map(
        userUnitsProgress.map(up => [
          up.unitId,
          {
            isUnlocked: up.isUnlocked,
            completed: up.completed,
            progress: up.progress,
          },
        ])
      );

      const userLessonCompletionMap = new Map(
        userLessonsCompletion.map(lc => [
          lc.lessonId,
          { completed: lc.completed },
        ])
      );

      // Enrich chapters with progress
      chapters.forEach((chapter) => {
        chapter.units.forEach((unit: any) => {
          unit.userProgress = userProgressMap.get(unit.id) || {
            isUnlocked: false,
            completed: false,
            progress: 0,
          };

          unit.lessons.forEach((lesson: any) => {
            lesson.userCompletion = userLessonCompletionMap.get(lesson.id) || {
              completed: false,
            };
          });
        });
      });

      const response = NextResponse.json({ chapters });
      response.headers.set('Cache-Control', 'private, max-age=300'); // User-specific: 5 minutes
      return response;
    }

    const response = NextResponse.json({ chapters });
    response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=3600'); // CDN: 1 hour
    return response;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { message: 'Failed to fetch chapters', error: String(error) },
      { status: 500 }
    );
  }
}
