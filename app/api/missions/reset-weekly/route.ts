import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { MissionEngine } from "@/lib/services/mission-engine";

/**
 * POST /api/missions/reset-weekly
 * Cron endpoint to generate weekly missions
 * Should be called on Monday at midnight via Vercel cron
 * 
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/missions/reset-weekly",
 *     "schedule": "0 0 * * 1"
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

    // Expire old missions first
    const expiredCount = await MissionEngine.expireMissions();

    // Get all active users who logged in within the last 14 days
    const recentUsers = await prisma.user.findMany({
      where: {
        lastActiveAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
      },
      select: { id: true },
    });

    // Generate weekly missions for each active user
    let generatedCount = 0;
    for (const user of recentUsers) {
      await MissionEngine.generateWeeklyMissions(user.id);
      generatedCount++;
    }

    return NextResponse.json({
      success: true,
      expiredMissions: expiredCount,
      usersProcessed: generatedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in weekly mission reset:", error);
    return NextResponse.json(
      { error: "Failed to reset weekly missions" },
      { status: 500 }
    );
  }
}
