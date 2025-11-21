'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface LessonStats {
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
  eloChange: number;
}

interface LessonCompleteProps {
  stats: LessonStats;
}

export function LessonComplete({ stats }: LessonCompleteProps) {
  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.correctCount / stats.totalQuestions) * 100)
      : 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Card className="w-full max-w-md p-8 bg-white shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h1 className="text-3xl font-bold text-gray-900">Lesson Complete!</h1>
          <p className="text-gray-600 mt-2">Awesome job!</p>
        </div>

        {/* Stats */}
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Questions Correct</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.correctCount}/{stats.totalQuestions}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Accuracy</p>
            <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">XP Earned</p>
            <p className="text-3xl font-bold text-yellow-600">+{stats.xpEarned}</p>
          </div>

          {stats.eloChange !== 0 && (
            <div className={`p-4 rounded-lg ${
              stats.eloChange > 0 ? 'bg-purple-50' : 'bg-red-50'
            }`}>
              <p className="text-sm text-gray-600">Elo Rating Change</p>
              <p
                className={`text-3xl font-bold ${
                  stats.eloChange > 0 ? 'text-purple-600' : 'text-red-600'
                }`}
              >
                {stats.eloChange > 0 ? '+' : ''}{stats.eloChange}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/lesson" className="block">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              Back to Lessons
            </Button>
          </Link>
          <Link href="/lesson/[lessonId]" className="block">
            <Button variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry Lesson
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
