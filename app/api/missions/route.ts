import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma/client";
import { MissionStatus } from "@/lib/generated/prisma/client";
import { MissionEngine } from "@/lib/services/mission-engine";

/**
 * GET /api/missions
 * Returns user's active missions (pending + recently completed)
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    // Generate daily missions if needed
    await MissionEngine.generateDailyMissions(userId);

    // Generate weekly missions if needed (on Monday or if none exist)
    await MissionEngine.generateWeeklyMissions(userId);

    // Get all active missions (pending, completed, or claimed if current)
    const missions = await prisma.mission.findMany({
      where: {
        userId,
        OR: [
          // Active pending missions
          {
            status: MissionStatus.PENDING,
            expiresAt: { gt: now },
          },
          // Completed but unclaimed missions (user can still claim)
          {
            status: MissionStatus.COMPLETED,
            claimedAt: null,
          },
          // Claimed missions (show them if they haven't expired yet - e.g. today's daily quests)
          {
            status: MissionStatus.CLAIMED,
            expiresAt: { gt: now },
          },
        ],
      },
      include: {
        reward: true,
        language: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ type: "asc" }, { createdAt: "desc" }],
    });

    // Group by type
    const grouped = {
      daily: missions.filter((m) => m.type === "DAILY"),
      weekly: missions.filter((m) => m.type === "WEEKLY"),
      event: missions.filter((m) => m.type === "EVENT"),
    };

    return NextResponse.json({
      missions,
      grouped,
      total: missions.length,
    });
  } catch (error) {
    console.error("Error fetching missions:", error);
    return NextResponse.json(
      { error: "Failed to fetch missions" },
      { status: 500 }
    );
  }
}
