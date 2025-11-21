import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserAbilitySummary } from '@/lib/adaptive-engine';
import { prisma } from '@/lib/prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ability/update
 * Retrieve user's current ability and stats
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const abilitySummary = await getUserAbilitySummary(userId);

    return NextResponse.json({
      success: true,
      data: abilitySummary,
    });
  } catch (error) {
    console.error('Error fetching ability summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ability/update
 * Manually update user's ability (for admin/testing)
 * Body: { skillId: string, eloRating: number }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { skillId = 'general', eloRating } = body;

    // Validate input
    if (typeof eloRating !== 'number' || eloRating < 400 || eloRating > 2800) {
      return NextResponse.json(
        { error: 'Invalid Elo rating (must be between 400-2800)' },
        { status: 400 }
      );
    }

    // Find or create mastery level
    let masteryLevel = await prisma.masteryLevel.findUnique({
      where: {
        userId_skillId: { userId, skillId },
      },
    });

    if (!masteryLevel) {
      masteryLevel = await prisma.masteryLevel.create({
        data: {
          userId,
          skillId,
          eloRating,
        },
      });
    } else {
      masteryLevel = await prisma.masteryLevel.update({
        where: {
          userId_skillId: { userId, skillId },
        },
        data: { eloRating },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        skillId: masteryLevel.skillId,
        eloRating: Math.round(masteryLevel.eloRating),
        updated: true,
      },
    });
  } catch (error) {
    console.error('Error updating ability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
