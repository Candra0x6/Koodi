'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle, Play } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  unit: {
    id: string;
    title: string;
    chapterId: string;
  };
  difficulty: number;
  xpReward: number;
}

interface Chapter {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
  completedCount: number;
  totalCount: number;
}

interface ChaptersDisplayProps {
  chapters: Chapter[];
  difficulty: string | null;
}

export default function ChaptersDisplay({
  chapters,
  difficulty,
}: ChaptersDisplayProps) {
  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Chapters</h1>
        <p className="text-gray-600">
          Your personalized learning path
          {difficulty && (
            <>
              {' '}
              • Level:{' '}
              <Badge className={difficultyColors[difficulty.toLowerCase()] || ''}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            </>
          )}
        </p>
      </div>

      {/* Chapters Grid */}
      <div className="grid gap-6">
        {chapters.map((chapter) => (
          <Card key={chapter.id} className="p-6 bg-white hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {chapter.title}
                </h2>
                {chapter.description && (
                  <p className="text-gray-600 text-sm">{chapter.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  {chapter.completedCount}/{chapter.totalCount}
                </div>
                <p className="text-xs text-gray-500">lessons completed</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{
                  width: `${
                    chapter.totalCount > 0
                      ? (chapter.completedCount / chapter.totalCount) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            {/* Lessons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {chapter.lessons.map((lesson, idx) => (
                <Link
                  key={lesson.id}
                  href={`/lesson/${lesson.id}`}
                  className="group"
                >
                  <Card className="p-4 bg-gradient-to-br from-white to-gray-50 hover:from-indigo-50 hover:to-indigo-50 border border-gray-200 hover:border-indigo-300 transition cursor-pointer h-full">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            Lesson {idx + 1}
                          </span>
                          {(lesson.difficulty === 1 || lesson.difficulty === 2) && (
                            <Badge variant="outline" className="text-xs">
                              {lesson.difficulty === 1
                                ? 'Beginner'
                                : 'Intermediate'}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition mb-1">
                          {lesson.title}
                        </h3>
                        {lesson.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                      <div className="ml-3 flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-xs font-semibold text-yellow-600">
                          <span>⭐</span>
                          <span>{lesson.xpReward}</span>
                        </div>
                        <div className="text-xl">
                          <CheckCircle className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100 transition" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {chapters.length === 0 && (
        <Card className="p-12 bg-white text-center">
          <p className="text-gray-600 mb-4">No chapters available yet</p>
          <Link href="/onboarding">
            <Button>Complete Onboarding</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
