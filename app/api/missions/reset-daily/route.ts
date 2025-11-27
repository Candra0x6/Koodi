import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { MissionEngine } from "@/lib/services/mission-engine";

/**
 * POST /api/missions/reset-daily
 * Cron endpoint to expire old daily missions and generate new ones
 * Should be called at midnight via Vercel cron
 * 
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/missions/reset-daily",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Expire old missions
    const expiredCount = await MissionEngine.expireMissions();

    // Get all active users who logged in within the last 7 days
    const recentUsers = await prisma.user.findMany({
      where: {
        lastActiveAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: { id: true },
    });

    // Generate daily missions for each active user
    let generatedCount = 0;
    for (const user of recentUsers) {
      await MissionEngine.generateDailyMissions(user.id);
      generatedCount++;
    }

    return NextResponse.json({
      success: true,
      expiredMissions: expiredCount,
      usersProcessed: generatedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in daily mission reset:", error);
    return NextResponse.json(
      { error: "Failed to reset daily missions" },
      { status: 500 }
    );
  }
}
