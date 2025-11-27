import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { MissionEngine, MissionEvent } from "@/lib/services/mission-engine";

/**
 * POST /api/missions/progress
 * Internal endpoint to update mission progress based on events
 * Called by other parts of the app (lesson completion, XP gain, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { event } = body as { event: MissionEvent };

    if (!event || !event.type) {
      return NextResponse.json(
        { error: "Event type is required" },
        { status: 400 }
      );
    }

    // Validate event type
    const validEventTypes = [
      "XP_GAINED",
      "LESSON_COMPLETED",
      "MISTAKE_FIXED",
      "STREAK_UPDATED",
      "QUESTION_ANSWERED",
    ];

    if (!validEventTypes.includes(event.type)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }

    await MissionEngine.updateProgress(session.user.id, event);

    return NextResponse.json({
      success: true,
      message: "Mission progress updated",
    });
  } catch (error) {
    console.error("Error updating mission progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
