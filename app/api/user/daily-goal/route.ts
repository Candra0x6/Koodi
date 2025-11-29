import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma/client";

/**
 * POST /api/user/daily-goal
 * Updates the user's daily XP goal
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { dailyXpGoal } = body;

    // Validate the goal value
    if (typeof dailyXpGoal !== "number" || dailyXpGoal < 10 || dailyXpGoal > 500) {
      return NextResponse.json(
        { error: "Daily goal must be between 10 and 500 XP" },
        { status: 400 }
      );
    }

    // Update user's daily goal
    await prisma.user.update({
      where: { id: session.user.id },
      data: { dailyXpGoal },
    });

    return NextResponse.json({
      success: true,
      message: "Daily goal updated successfully",
      dailyXpGoal,
    });
  } catch (error) {
    console.error("Error updating daily goal:", error);
    return NextResponse.json(
      { error: "Failed to update daily goal" },
      { status: 500 }
    );
  }
}
