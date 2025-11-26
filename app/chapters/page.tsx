'use client';

import { Suspense, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Lock, CheckCircle, Circle } from 'lucide-react';
import { auth } from '@/auth';
import { useAuth } from '@/lib/hooks/use-auth';

interface Chapter {
  id: string;
  title: string;
  levelIndex: number;
  units: Unit[];
}

interface Unit {
  id: string;
  title: string;
  unitIndex: number;
  lessons: Lesson[];
  userProgress?: {
    isUnlocked: boolean;
    completed: boolean;
    progress: number;
  };
}

interface Lesson {
  id: string;
  title: string;
  lessonIndex: number;
  type: string;
  userCompletion?: {
    completed: boolean;
  };
}

function ChaptersContent() {
  const {user} = useAuth()
  const languageId = user?.selectedLanguageId || '';
  console.log('Language ID in ChaptersPage:', languageId);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [resumeLesson, setResumeLesson] = useState<any>(null);

  useEffect(() => {
    const loadChapters = async () => {
      try {
        

        // Get user ID from session
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        if (session?.user?.id) {
          setUserId(session.user.id);

          // Fetch resume lesson
          const resumeRes = await fetch(`/api/lessons/resume?languageId=${languageId}`);
          if (resumeRes.ok) {
            const resumeData = await resumeRes.json();
            if (resumeData.lesson) {
              setResumeLesson(resumeData.lesson);
            }
          }
        }

        // Fetch chapters for the language
        const res = await fetch(`/api/chapters?languageId=${languageId}`);
        if (!res.ok) {
          throw new Error('Failed to load chapters');
        }

        const data = await res.json();
        setChapters(data.chapters || []);
      } catch (error) {
        console.error('Error loading chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, [languageId]);

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const toggleUnit = (unitId: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const getChapterProgress = (chapter: Chapter): number => {
    if (chapter.units.length === 0) return 0;
    const completed = chapter.units.filter(
      (u) => u.userProgress?.completed
    ).length;
    return Math.round((completed / chapter.units.length) * 100);
  };

  const getUnitProgress = (unit: Unit): number => {
    if (!unit.lessons || unit.lessons.length === 0) return 0;
    const completed = unit.lessons.filter(
      (l) => l.userCompletion?.completed
    ).length;
    return Math.round((completed / unit.lessons.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-4 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-600">Loading your learning path...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🗺️ Your Learning Path</h1>
          <p className="text-gray-600">
            Progress through chapters to master the fundamentals and advance your skills.
          </p>
        </div>

        {/* Resume Button */}
        {resumeLesson && (
          <div className="mb-6">
            <Button
              onClick={() => {
                window.location.href = `/lessons/${resumeLesson.id}?languageId=${languageId}`;
              }}
              className="w-full bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-6 text-lg font-semibold shadow-lg"
            >
              ▶️ Resume: {resumeLesson.title}
            </Button>
          </div>
        )}

        {/* Chapters List */}
        <div className="space-y-4">
          {chapters.map((chapter) => {
            const isExpanded = expandedChapters.has(chapter.id);
            const progress = getChapterProgress(chapter);

            return (
              <Card
                key={chapter.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Chapter Header */}
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div className="text-3xl">
                      {chapter.levelIndex === 1
                        ? '🌱'
                        : chapter.levelIndex === 2
                          ? '🌿'
                          : chapter.levelIndex === 3
                            ? '🌳'
                            : chapter.levelIndex === 4
                              ? '🏔️'
                              : '🏆'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {chapter.units.length} units • {Math.round(progress)}% complete
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    size={20}
                  />
                </button>

                {/* Progress Bar */}
                <div className="px-6 pb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-linear-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Units (Expandable) */}
                {isExpanded && (
                  <div className="border-t border-gray-200 divide-y">
                    {chapter.units.map((unit) => {
                      const unitExpanded = expandedUnits.has(unit.id);
                      const unitProgress = getUnitProgress(unit);
                      const isLocked = !unit.userProgress?.isUnlocked;

                      return (
                        <div key={unit.id}>
                          {/* Unit Header */}
                          <button
                            onClick={() => !isLocked && toggleUnit(unit.id)}
                            disabled={isLocked}
                            className={`w-full p-4 flex items-center justify-between ${
                              isLocked
                                ? 'cursor-not-allowed opacity-60 bg-gray-50'
                                : 'hover:bg-gray-50 transition-colors'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1 text-left">
                              {isLocked ? (
                                <Lock size={18} className="text-gray-400" />
                              ) : unit.userProgress?.completed ? (
                                <CheckCircle size={18} className="text-green-500" />
                              ) : (
                                <Circle size={18} className="text-blue-500" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{unit.title}</p>
                                <p className="text-sm text-gray-600">
                                  {unit.lessons?.length || 0} lessons • {unitProgress}% complete
                                </p>
                              </div>
                            </div>
                            {!isLocked && (
                              <ChevronDown
                                className={`transition-transform ${unitExpanded ? 'rotate-180' : ''}`}
                                size={18}
                              />
                            )}
                          </button>

                          {/* Unit Progress Bar */}
                          {!isLocked && (
                            <div className="px-4 pb-3 bg-gray-50">
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-linear-to-r from-green-500 to-teal-500 h-1.5 rounded-full transition-all"
                                  style={{ width: `${unitProgress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Lessons (Expandable) */}
                          {unitExpanded && !isLocked && (
                            <div className="bg-gray-50 p-4 space-y-2">
                              {unit.lessons?.map((lesson) => (
                                <button
                                  key={lesson.id}
                                  onClick={() =>
                                    (window.location.href = `/lessons/${lesson.id}?languageId=${languageId}`)
                                  }
                                  className="w-full flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors cursor-pointer text-left"
                                >
                                  {lesson.userCompletion?.completed ? (
                                    <CheckCircle size={16} className="text-green-500 shrink-0" />
                                  ) : (
                                    <Circle size={16} className="text-gray-300 shrink-0" />
                                  )}
                                  <span className="text-sm font-medium text-gray-900 flex-1">
                                    {lesson.title}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Locked Message */}
                          {isLocked && (
                            <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 text-center">
                              Complete the previous unit to unlock
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {chapters.length === 0 && !loading && (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Chapters Found</h3>
            <p className="text-gray-600">
              It looks like the learning path hasn't been set up yet. Try completing onboarding again.
            </p>
            <Button
              onClick={() => (window.location.href = '/onboarding')}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700"
            >
              Start Onboarding
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function ChaptersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-4 flex items-center justify-center">
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-gray-600">Loading your learning path...</p>
          </Card>
        </div>
      }
    >
      <ChaptersContent />
    </Suspense>
  );
}
