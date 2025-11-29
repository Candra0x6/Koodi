import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma/client"

/**
 * POST /api/user/languages/add
 * Adds a new language for the user to learn
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { languageId, skillLevel = "BEGINNER" } = body

    if (!languageId) {
      return NextResponse.json(
        { error: "Language ID is required" },
        { status: 400 }
      )
    }

    // Check if language exists
    const language = await prisma.language.findUnique({
      where: { id: languageId },
    })

    if (!language) {
      return NextResponse.json({ error: "Language not found" }, { status: 404 })
    }

    // Check if user already learning this language
    const existingProgress = await prisma.userLanguageProgress.findUnique({
      where: {
        userId_languageId: {
          userId,
          languageId,
        },
      },
    })

    if (existingProgress) {
      return NextResponse.json(
        { error: "Already learning this language" },
        { status: 400 }
      )
    }

    // Get first chapter for this language
    const firstChapter = await prisma.chapter.findFirst({
      where: { languageId },
      orderBy: { levelIndex: "asc" },
    })

    // Create user language progress record
    const userLanguageProgress = await prisma.userLanguageProgress.create({
      data: {
        userId,
        languageId,
        skillLevel,
        currentChapterId: firstChapter?.id || null,
        isActive: true,
      },
      include: {
        language: true,
        currentChapter: true,
      },
    })

    return NextResponse.json({
      success: true,
      userLanguageProgress,
    })
  } catch (error) {
    console.error("Error adding language:", error)
    return NextResponse.json(
      { error: "Failed to add language" },
      { status: 500 }
    )
  }
}
