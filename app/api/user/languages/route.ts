import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma/client"

/**
 * GET /api/user/languages
 * Fetches all languages the user is learning and their active language
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get all user language progress records
    const userLanguages = await prisma.userLanguageProgress.findMany({
      where: { userId },
      include: {
        language: true,
        currentChapter: true,
      },
      orderBy: { createdAt: "asc" },
    })

    // Get the active language (first active one, or most recent)
    const activeLanguage = userLanguages.find((ul) => ul.isActive)

    return NextResponse.json({
      success: true,
      languages: userLanguages,
      activeLanguage,
    })
  } catch (error) {
    console.error("Error fetching user languages:", error)
    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: 500 }
    )
  }
}
