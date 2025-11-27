import { prisma } from "@/lib/prisma/client";
import {
  MissionCategory,
  MissionStatus,
  MissionType,
} from "@/lib/generated/prisma/client";

// Event types that can trigger mission progress
export type MissionEvent =
  | { type: "XP_GAINED"; amount: number }
  | { type: "LESSON_COMPLETED"; lessonType?: string }
  | { type: "MISTAKE_FIXED" }
  | { type: "STREAK_UPDATED"; streakCount: number }
  | { type: "QUESTION_ANSWERED"; questionType: string; isCorrect: boolean };

// Map event types to mission categories
const EVENT_TO_CATEGORY: Record<string, MissionCategory[]> = {
  XP_GAINED: [MissionCategory.XP],
  LESSON_COMPLETED: [
    MissionCategory.LESSON,
    MissionCategory.STORY,
    MissionCategory.ROLEPLAY,
    MissionCategory.VIDEO,
  ],
  MISTAKE_FIXED: [MissionCategory.BUG_FIX],
  STREAK_UPDATED: [], // Streak missions handled separately
  QUESTION_ANSWERED: [
    MissionCategory.BUG_FIX,
    MissionCategory.PREDICT,
    MissionCategory.LOGIC,
  ],
};

/**
 * MissionEngine - Handles mission progress tracking
 */
export const MissionEngine = {
  /**
   * Update mission progress based on user events
   */
  async updateProgress(userId: string, event: MissionEvent): Promise<void> {
    const now = new Date();

    // Get user's active (PENDING) missions that haven't expired
    const activeMissions = await prisma.mission.findMany({
      where: {
        userId,
        status: MissionStatus.PENDING,
        expiresAt: { gt: now },
      },
    });

    if (activeMissions.length === 0) return;

    const updates: Promise<unknown>[] = [];

    for (const mission of activeMissions) {
      const shouldUpdate = this.shouldUpdateMission(mission.category, event);
      if (!shouldUpdate) continue;

      const incrementAmount = this.getIncrementAmount(event);
      const newCount = Math.min(
        mission.currentCount + incrementAmount,
        mission.targetCount
      );
      const isCompleted = newCount >= mission.targetCount;

      updates.push(
        prisma.mission.update({
          where: { id: mission.id },
          data: {
            currentCount: newCount,
            status: isCompleted ? MissionStatus.COMPLETED : MissionStatus.PENDING,
          },
        })
      );
    }

    await Promise.all(updates);
  },

  /**
   * Check if a mission should be updated based on event type
   */
  shouldUpdateMission(category: MissionCategory, event: MissionEvent): boolean {
    const relevantCategories = EVENT_TO_CATEGORY[event.type] || [];

    // Special handling for lesson types
    if (event.type === "LESSON_COMPLETED" && event.lessonType) {
      const lessonTypeMap: Record<string, MissionCategory> = {
        STORY: MissionCategory.STORY,
        ROLEPLAY: MissionCategory.ROLEPLAY,
        VIDEO: MissionCategory.VIDEO,
      };
      if (lessonTypeMap[event.lessonType]) {
        return category === lessonTypeMap[event.lessonType];
      }
      return category === MissionCategory.LESSON;
    }

    // Special handling for question types
    if (event.type === "QUESTION_ANSWERED" && event.isCorrect) {
      const questionTypeMap: Record<string, MissionCategory> = {
        DEBUG_HUNT: MissionCategory.BUG_FIX,
        PREDICT_OUTPUT: MissionCategory.PREDICT,
        LOGIC_PUZZLE: MissionCategory.LOGIC,
      };
      if (questionTypeMap[event.questionType]) {
        return category === questionTypeMap[event.questionType];
      }
    }

    return relevantCategories.includes(category);
  },

  /**
   * Get the increment amount based on event type
   */
  getIncrementAmount(event: MissionEvent): number {
    if (event.type === "XP_GAINED") {
      return event.amount;
    }
    return 1;
  },

  /**
   * Generate daily missions for a user
   */
  async generateDailyMissions(userId: string): Promise<void> {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if user already has daily missions for today
    const existingDaily = await prisma.mission.findFirst({
      where: {
        userId,
        type: MissionType.DAILY,
        createdAt: { gte: new Date(now.setHours(0, 0, 0, 0)) },
      },
    });

    if (existingDaily) return;

    // Create standard daily missions
    const dailyMissions = [
      {
        category: MissionCategory.XP,
        goal: "Earn 20 XP today",
        targetCount: 20,
        reward: { xp: 10, gems: 5 },
      },
      {
        category: MissionCategory.LESSON,
        goal: "Complete 1 lesson",
        targetCount: 1,
        reward: { xp: 15, gems: 10 },
      },
      {
        category: MissionCategory.BUG_FIX,
        goal: "Fix 3 bugs",
        targetCount: 3,
        reward: { xp: 20, gems: 15 },
      },
    ];

    for (const mission of dailyMissions) {
      await prisma.mission.create({
        data: {
          userId,
          type: MissionType.DAILY,
          category: mission.category,
          goal: mission.goal,
          targetCount: mission.targetCount,
          expiresAt: endOfDay,
          reward: {
            create: {
              xp: mission.reward.xp,
              gems: mission.reward.gems,
            },
          },
        },
      });
    }
  },

  /**
   * Generate weekly missions for a user
   */
  async generateWeeklyMissions(userId: string): Promise<void> {
    const now = new Date();
    
    // Get end of week (next Sunday 23:59:59)
    const endOfWeek = new Date(now);
    const daysUntilSunday = 7 - now.getDay();
    endOfWeek.setDate(now.getDate() + daysUntilSunday);
    endOfWeek.setHours(23, 59, 59, 999);

    // Get start of current week (Monday 00:00:00)
    const startOfWeek = new Date(now);
    const daysSinceMonday = (now.getDay() + 6) % 7;
    startOfWeek.setDate(now.getDate() - daysSinceMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Check if user already has weekly missions for this week
    const existingWeekly = await prisma.mission.findFirst({
      where: {
        userId,
        type: MissionType.WEEKLY,
        createdAt: { gte: startOfWeek },
      },
    });

    if (existingWeekly) return;

    // Create standard weekly missions
    const weeklyMissions = [
      {
        category: MissionCategory.XP,
        goal: "Earn 150 XP this week",
        targetCount: 150,
        reward: { xp: 50, gems: 25 },
      },
      {
        category: MissionCategory.LESSON,
        goal: "Complete 10 lessons this week",
        targetCount: 10,
        reward: { xp: 75, gems: 40, hearts: 3 },
      },
    ];

    for (const mission of weeklyMissions) {
      await prisma.mission.create({
        data: {
          userId,
          type: MissionType.WEEKLY,
          category: mission.category,
          goal: mission.goal,
          targetCount: mission.targetCount,
          expiresAt: endOfWeek,
          reward: {
            create: {
              xp: mission.reward.xp,
              gems: mission.reward.gems,
              hearts: mission.reward.hearts ?? 0,
            },
          },
        },
      });
    }
  },

  /**
   * Reset expired missions (for cron job)
   */
  async expireMissions(): Promise<number> {
    const now = new Date();

    const result = await prisma.mission.updateMany({
      where: {
        status: MissionStatus.PENDING,
        expiresAt: { lt: now },
      },
      data: {
        status: MissionStatus.COMPLETED, // Mark as completed but unclaimed = expired
      },
    });

    return result.count;
  },
};
