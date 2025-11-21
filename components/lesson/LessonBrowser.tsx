'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, Loader } from 'lucide-react';
import { DefaultSession } from 'next-auth';

interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  units: Unit[];
}

interface Unit {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  difficulty: number;
  xpReward: number;
}

interface LessonBrowserProps {
  user: DefaultSession['user'];
}

export default function LessonBrowser({ user }: LessonBrowserProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lesson/chapters');
      if (!response.ok) throw new Error('Failed to fetch chapters');

      const data = await response.json();
      setChapters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-center">
          <Loader className="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <Card className="p-8 max-w-md">
          <p className="text-red-600 font-semibold">Error: {error}</p>
          <Button onClick={fetchChapters} className="mt-4 w-full">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-10 w-10 text-indigo-600" />
            My Lessons
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome, {user?.username || user?.email}! Choose a lesson to start learning.
          </p>
        </div>

        {/* Chapters */}
        <div className="space-y-8">
          {chapters.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No chapters available yet.</p>
            </Card>
          ) : (
            chapters.map((chapter) => (
              <div key={chapter.id}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Badge variant="secondary">{chapter.order}</Badge>
                  {chapter.title}
                </h2>
                {chapter.description && (
                  <p className="text-gray-600 mb-4">{chapter.description}</p>
                )}

                {/* Units */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {chapter.units.map((unit) => (
                    <Card
                      key={unit.id}
                      className="p-6 hover:shadow-lg transition-shadow bg-white"
                    >
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Badge>{unit.order}</Badge>
                          {unit.title}
                        </h3>
                        {unit.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {unit.description}
                          </p>
                        )}
                      </div>

                      {/* Lessons in Unit */}
                      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                        {unit.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-2 rounded bg-gray-50 hover:bg-gray-100"
                          >
                            <span className="text-sm font-medium text-gray-800">
                              {lesson.title}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {lesson.xpReward} XP
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {/* Start Button */}
                      {unit.lessons.length > 0 && (
                        <Link href={`/lesson/${unit.lessons[0].id}`}>
                          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                            Start <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
