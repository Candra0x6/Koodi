import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { RewardEngine } from "@/lib/services/reward-engine";

/**
 * POST /api/missions/claim
 * Claims a completed mission's reward
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { missionId } = body;

    if (!missionId || typeof missionId !== "string") {
      return NextResponse.json(
        { error: "Mission ID is required" },
        { status: 400 }
      );
    }

    const result = await RewardEngine.claimMissionReward(
      session.user.id,
      missionId
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Reward claimed successfully",
      rewards: result.reward,
    });
  } catch (error) {
    console.error("Error claiming mission reward:", error);
    return NextResponse.json(
      { error: "Failed to claim reward" },
      { status: 500 }
    );
  }
}
