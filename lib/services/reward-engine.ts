import { prisma } from "@/lib/prisma/client";
import { XPSource } from "@/lib/generated/prisma/client";

interface MissionRewardData {
  xp: number;
  gems: number;
  hearts: number;
  streakFreeze: number;
  xpBooster: number;
  items: string[];
}

/**
 * RewardEngine - Handles granting rewards to users
 */
export const RewardEngine = {
  /**
   * Grant XP to a user and log it
   */
  async grantXP(
    userId: string,
    amount: number,
    source: XPSource
  ): Promise<void> {
    await prisma.$transaction([
      // Update user XP
      prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: amount },
        },
      }),
      // Log the XP gain
      prisma.xPLog.create({
        data: {
          userId,
          amount,
          source,
        },
      }),
    ]);
  },

  /**
   * Grant gems to a user
   */
  async grantGems(userId: string, amount: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        gems: { increment: amount },
      },
    });
  },

  /**
   * Grant hearts to a user
   */
  async grantHearts(userId: string, amount: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        hearts: { increment: amount },
      },
    });
  },

  /**
   * Grant a mission reward to a user
   */
  async grantMissionReward(
    userId: string,
    reward: MissionRewardData
  ): Promise<void> {
    const updates: Promise<unknown>[] = [];

    // Grant XP if any
    if (reward.xp > 0) {
      updates.push(this.grantXP(userId, reward.xp, XPSource.MISSION));
    }

    // Grant gems if any
    if (reward.gems > 0) {
      updates.push(this.grantGems(userId, reward.gems));
    }

    // Grant hearts if any
    if (reward.hearts > 0) {
      updates.push(this.grantHearts(userId, reward.hearts));
    }

    // TODO: Handle streakFreeze, xpBooster, and items when inventory system is implemented
    // For now, these are logged but not applied

    await Promise.all(updates);
  },

  /**
   * Claim a completed mission's reward
   */
  async claimMissionReward(
    userId: string,
    missionId: string
  ): Promise<{ success: boolean; error?: string }> {
    // Get the mission with its reward
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { reward: true },
    });

    if (!mission) {
      return { success: false, error: "Mission not found" };
    }

    if (mission.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    if (mission.status !== "COMPLETED") {
      return { success: false, error: "Mission not completed" };
    }

    if (mission.claimedAt) {
      return { success: false, error: "Reward already claimed" };
    }

    if (!mission.reward) {
      return { success: false, error: "No reward found for this mission" };
    }

    // Grant the reward
    await this.grantMissionReward(userId, {
      xp: mission.reward.xp,
      gems: mission.reward.gems,
      hearts: mission.reward.hearts,
      streakFreeze: mission.reward.streakFreeze,
      xpBooster: mission.reward.xpBooster,
      items: mission.reward.items,
    });

    // Mark mission as claimed
    await prisma.mission.update({
      where: { id: missionId },
      data: {
        status: "CLAIMED",
        claimedAt: new Date(),
      },
    });

    return { success: true };
  },

  /**
   * Get user's XP history for analytics
   */
  async getXPHistory(
    userId: string,
    days: number = 7
  ): Promise<{ date: Date; amount: number; source: XPSource }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.xPLog.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        amount: true,
        source: true,
      },
    });

    return logs.map((log) => ({
      date: log.createdAt,
      amount: log.amount,
      source: log.source,
    }));
  },

  /**
   * Get total XP earned in a time period
   */
  async getTotalXP(
    userId: string,
    since: Date
  ): Promise<number> {
    const result = await prisma.xPLog.aggregate({
      where: {
        userId,
        createdAt: { gte: since },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount ?? 0;
  },
};
