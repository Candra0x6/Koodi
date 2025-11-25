import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

/**
 * Get top users by XP (leaderboard)
 * Query params:
 * - limit: number of users to fetch (default 50, max 100)
 * - languageId (optional): filter by language
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const languageId = searchParams.get('languageId');

    const users = await prisma.user.findMany({
      where: languageId ? { selectedLanguageId: languageId } : undefined,
      select: {
        id: true,
        username: true,
        avatarId: true,
        xp: true,
        streak: true,
      },
      orderBy: [{ xp: 'desc' }, { streak: 'desc' }],
      take: limit,
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      ...user,
    }));

    return NextResponse.json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { message: 'Failed to fetch leaderboard', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
