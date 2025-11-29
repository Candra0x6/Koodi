import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '@/auth';
import { createChapterStructure } from '@/lib/chapter-seeder';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  const session = await auth();
  try {
    const body = await request.json();

    const {
      selectedLanguageId,
      learningGoal,
      avatarId,
      placementTestScore,
    } = body;

    let user;
    let userId: string;

    if (session?.user?.id) {
      // Get current user to check if they're a guest
      const existingUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isGuest: true },
      });

      // Update existing user (works for both guest and regular users)
      user = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          learningGoal,
          avatarId,
          placementTestScore,
          onboardingCompleted: true,
          // Keep isGuest status as-is (guest users stay guest until they add email/password)
        },
      });
      userId = user.id;
    } else {
      return NextResponse.json(
        { message: 'User authentication failed' },
        { status: 401 }
      );
    }

    // Create UserLanguageProgress for this language
    await prisma.userLanguageProgress.upsert({
      where: {
        userId_languageId: {
          userId,
          languageId: selectedLanguageId,
        },
      },
      update: {
        isActive: true,
        skillLevel: 'BEGINNER',
      },
      create: {
        userId,
        languageId: selectedLanguageId,
        skillLevel: 'BEGINNER',
        isActive: true,
      },
    });

    // Get the selected language
    const language = await prisma.language.findUnique({
      where: { id: selectedLanguageId },
    });

    if (!language) {
      return NextResponse.json(
        { message: 'Language not found' },
        { status: 400 }
      );
    }

    // Check if chapter structure already exists for this language
    const existingChapters = await prisma.chapter.findMany({
      where: { languageId: selectedLanguageId },
      take: 1,
    });

    // Get all units for this language in order
    const allUnits = await prisma.unit.findMany({
      where: {
        chapter: { languageId: selectedLanguageId },
      },
      orderBy: [
        { chapter: { levelIndex: 'asc' } },
        { unitIndex: 'asc' },
      ],
    });

    // If no units exist, create chapter structure
    if (allUnits.length === 0) {
      console.log(`Creating chapter structure for ${language.name}...`);
      await createChapterStructure(prisma, selectedLanguageId, language.name);

      // Fetch units again after creation
      const newUnits = await prisma.unit.findMany({
        where: {
          chapter: { languageId: selectedLanguageId },
        },
        orderBy: [
          { chapter: { levelIndex: 'asc' } },
          { unitIndex: 'asc' },
        ],
      });

      // Batch create all UserUnitProgress records
      const progressData = newUnits.map((unit, index) => ({
        userId,
        unitId: unit.id,
        isUnlocked: index === 0, // Only first unit unlocked
        completed: false,
        progress: 0,
      }));

      if (progressData.length > 0) {
        await prisma.userUnitProgress.createMany({
          data: progressData,
          skipDuplicates: true,
        });
      }
    } else {
      // Batch create progress records for existing units
      const progressData = allUnits.map((unit, index) => ({
        userId,
        unitId: unit.id,
        isUnlocked: index === 0, // Only first unit unlocked
        completed: false,
        progress: 0,
      }));

      if (progressData.length > 0) {
        await prisma.userUnitProgress.createMany({
          data: progressData,
          skipDuplicates: true,
        });
      }
    }

    return NextResponse.json({
      success: true,
      userId,
      redirectUrl: `/chapters?languageId=${selectedLanguageId}`,
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { message: 'Failed to complete onboarding', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

