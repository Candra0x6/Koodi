import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma/client";
import { MissionStatus } from "@/lib/generated/prisma/client";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch claimed missions with rewards
    const claimedMissions = await prisma.mission.findMany({
      where: {
        userId,
        status: MissionStatus.CLAIMED,
      },
      include: {
        reward: true,
        language: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        claimedAt: "desc",
      },
    });

    // Calculate total rewards earned
    const totalRewards = claimedMissions.reduce(
      (acc, mission) => {
        if (mission.reward) {
          acc.xp += mission.reward.xp;
          acc.gems += mission.reward.gems;
          acc.hearts += mission.reward.hearts;
        }
        return acc;
      },
      { xp: 0, gems: 0, hearts: 0 }
    );

    return NextResponse.json({
      history: claimedMissions,
      totals: totalRewards,
    });
  } catch (error) {
    console.error("Error fetching rewards history:", error);
    return NextResponse.json(
      { error: "Failed to fetch rewards history" },
      { status: 500 }
    );
  }
}
