import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { message: 'languageId is required' },
        { status: 400 }
      );
    }

    const questions = await prisma.placementTest.findMany({
      where: {
        languageId,
      },
      take: 5, // Return up to 5 questions
      select: {
        id: true,
        content: true,
        choices: true,
        answer: true,
        explanation: true,
        type: true,
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching placement test:', error);
    return NextResponse.json(
      { message: 'Failed to fetch placement test' },
      { status: 500 }
    );
  }
}
