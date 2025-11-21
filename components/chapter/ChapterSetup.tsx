'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle, Play, ChevronLeft } from 'lucide-react';

interface Unit {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Array<{
    id: string;
    title: string;
    xpReward: number;
  }>;
  status: string;
  xpEarned: number;
  completed: boolean;
}

interface Chapter {
  id: string;
  title: string;
  description?: string;
  order: number;
}

interface ChapterSetupProps {
  userId: string;
  chapter: Chapter;
  units: Unit[];
  chapterStatus: string;
}

export default function ChapterSetup({
  userId,
  chapter,
  units,
  chapterStatus,
}: ChapterSetupProps) {
  const completedUnits = units.filter((u) => u.completed).length;
  const totalUnits = units.length;
  const allUnitsCompleted = completedUnits === totalUnits;

  const handleStartUnit = async (unitId: string) => {
    // Store current unit session
    sessionStorage.setItem('currentUnitId', unitId);
    sessionStorage.setItem('currentChapterId', chapter.id);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/chapters">
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="text-right">
          <div className="text-sm font-semibold text-white">
            {completedUnits}/{totalUnits}
          </div>
          <div className="text-xs text-white/80">Units completed</div>
        </div>
      </div>

      {/* Chapter Title */}
      <Card className="mb-6 p-8 bg-white shadow-xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {chapter.title}
        </h1>
        {chapter.description && (
          <p className="text-gray-600">{chapter.description}</p>
        )}
      </Card>

      {/* Progress Bar */}
      <div className="mb-6 bg-white/20 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-500"
          style={{ width: `${(completedUnits / totalUnits) * 100}%` }}
        />
      </div>

      {/* Units List */}
      <div className="space-y-4 mb-8">
        {units.map((unit, idx) => {
          const isLocked = unit.status === 'locked';
          const isCompleted = unit.completed;
          const isActive = unit.status === 'unlocked' || unit.status === 'in_progress';

          return (
            <Card
              key={unit.id}
              className={`p-6 transition ${
                isLocked
                  ? 'bg-gray-200 opacity-60'
                  : 'bg-white hover:shadow-lg cursor-pointer'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-gray-500 uppercase">
                      Unit {idx + 1}
                    </span>
                    {isCompleted && (
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    )}
                    {isLocked && (
                      <Badge variant="outline" className="border-gray-400">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {unit.title}
                  </h3>
                  {unit.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {unit.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500">
                    {unit.lessons.length} lessons •{' '}
                    {unit.lessons.reduce((sum, l) => sum + l.xpReward, 0)} XP
                    {isCompleted && ` • Earned ${unit.xpEarned} XP`}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                      <span className="text-xs font-bold text-green-600">
                        {unit.xpEarned} XP
                      </span>
                    </div>
                  ) : isLocked ? (
                    <Lock className="h-12 w-12 text-gray-400" />
                  ) : (
                    <Link
                      href={`/unit/${unit.id}/quiz?chapterId=${chapter.id}`}
                      onClick={() => handleStartUnit(unit.id)}
                    >
                      <Button
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center"
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Chapter Complete Message */}
      {allUnitsCompleted && (
        <Card className="p-8 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">🎉 Chapter Complete!</h2>
          <p className="mb-4">You've mastered all units in this chapter.</p>
          <Link href="/chapters">
            <Button variant="outline" className="bg-white text-green-600 hover:bg-gray-100">
              Continue to Next Chapter
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
