import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma/client"

/**
 * POST /api/user/languages/switch
 * Switches the active language
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { languageId } = body

    if (!languageId) {
      return NextResponse.json(
        { error: "Language ID is required" },
        { status: 400 }
      )
    }

    // Check if user is learning this language
    const userLanguageProgress = await prisma.userLanguageProgress.findUnique({
      where: {
        userId_languageId: {
          userId,
          languageId,
        },
      },
    })

    if (!userLanguageProgress) {
      return NextResponse.json(
        { error: "User is not learning this language" },
        { status: 404 }
      )
    }

    // Deactivate all languages for this user
    await prisma.userLanguageProgress.updateMany(
      {
        where: { userId },
        data: { isActive: false },
      }
    )

    // Activate the selected language
    const updatedProgress = await prisma.userLanguageProgress.update({
      where: {
        userId_languageId: {
          userId,
          languageId,
        },
      },
      data: { isActive: true },
      include: {
        language: true,
        currentChapter: true,
      },
    })

    return NextResponse.json({
      success: true,
      activeLanguage: updatedProgress,
    })
  } catch (error) {
    console.error("Error switching language:", error)
    return NextResponse.json(
      { error: "Failed to switch language" },
      { status: 500 }
    )
  }
}
