'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Types matching the API response
interface MissionReward {
  id: string;
  missionId: string;
  xp: number;
  gems: number;
  hearts: number;
  streakFreeze: number;
  xpBooster: number;
  items: string[];
}

interface Mission {
  id: string;
  userId: string;
  type: 'DAILY' | 'WEEKLY' | 'EVENT';
  category: string;
  goal: string;
  targetCount: number;
  currentCount: number;
  languageId: string | null;
  expiresAt: string;
  status: 'PENDING' | 'COMPLETED' | 'CLAIMED';
  claimedAt: string | null;
  createdAt: string;
  updatedAt: string;
  reward: MissionReward | null;
  language?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface MissionsResponse {
  missions: Mission[];
  grouped: {
    daily: Mission[];
    weekly: Mission[];
    event: Mission[];
  };
  total: number;
}

interface ClaimRewardResult {
  xp?: number;
  gems?: number;
  hearts?: number;
}

interface UseMissionsReturn {
  missions: Mission[];
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  eventMissions: Mission[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  claimReward: (missionId: string) => Promise<ClaimRewardResult | null>;
}

/**
 * Hook to fetch and manage user missions
 */
export function useMissions(): UseMissionsReturn {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [grouped, setGrouped] = useState<MissionsResponse['grouped']>({
    daily: [],
    weekly: [],
    event: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/missions`);
      if (!res.ok) {
        throw new Error('Failed to fetch missions');
      }

      const data: MissionsResponse = await res.json();
      setMissions(data.missions);
      setGrouped(data.grouped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load missions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const claimReward = useCallback(async (missionId: string): Promise<ClaimRewardResult | null> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/missions/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to claim reward');
        return null;
      }

      const data = await res.json();
      toast.success('🎉 Reward claimed!');
      
      // Refetch missions to update state
      await fetchMissions();
      
      // Return the reward details
      return {
        xp: data.rewards?.xp || 0,
        gems: data.rewards?.gems || 0,
        hearts: data.rewards?.hearts || 0,
      };
    } catch (err) {
      toast.error('Failed to claim reward');
      return null;
    }
  }, [fetchMissions]);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  return {
    missions,
    dailyMissions: grouped.daily,
    weeklyMissions: grouped.weekly,
    eventMissions: grouped.event,
    isLoading,
    error,
    refetch: fetchMissions,
    claimReward,
  };
}

// Event types for mission progress
export type MissionEventType =
  | 'XP_GAINED'
  | 'LESSON_COMPLETED'
  | 'MISTAKE_FIXED'
  | 'STREAK_UPDATED'
  | 'QUESTION_ANSWERED';

interface MissionProgressEvent {
  type: MissionEventType;
  amount?: number;
  lessonType?: string;
  questionType?: string;
  isCorrect?: boolean;
  streakCount?: number;
}

/**
 * Hook to update mission progress
 */
export function useMissionProgress() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProgress = useCallback(async (event: MissionProgressEvent): Promise<boolean> => {
    try {
      setIsUpdating(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/missions/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
      });

      if (!res.ok) {
        return false;
      }

      // Show toast for progress update
      toast.success('🎯 Mission progress updated!', {
        duration: 2000,
        position: 'bottom-center',
      });

      return true;
    } catch {
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Helper functions for common events
  const onXPGained = useCallback((amount: number) => {
    return updateProgress({ type: 'XP_GAINED', amount });
  }, [updateProgress]);

  const onLessonCompleted = useCallback((lessonType?: string) => {
    return updateProgress({ type: 'LESSON_COMPLETED', lessonType });
  }, [updateProgress]);

  const onQuestionAnswered = useCallback((questionType: string, isCorrect: boolean) => {
    return updateProgress({ type: 'QUESTION_ANSWERED', questionType, isCorrect });
  }, [updateProgress]);

  const onMistakeFixed = useCallback(() => {
    return updateProgress({ type: 'MISTAKE_FIXED' });
  }, [updateProgress]);

  const onStreakUpdated = useCallback((streakCount: number) => {
    return updateProgress({ type: 'STREAK_UPDATED', streakCount });
  }, [updateProgress]);

  return {
    updateProgress,
    isUpdating,
    onXPGained,
    onLessonCompleted,
    onQuestionAnswered,
    onMistakeFixed,
    onStreakUpdated,
  };
}
