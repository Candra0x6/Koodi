"use client"

import { Suspense, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Home, Zap, Target, Shield, User, Bell, Lock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { UnitHeader, LearningPath, type UnitData, type LevelNode, type LevelStatus } from "@/components/learning-path"
import { useAuth } from "@/lib/hooks/use-auth"
import Image from "next/image"
import type { LucideIcon } from "lucide-react"

// --- Types ---

interface Lesson {
  id: string
  title: string
  lessonIndex: number
  userCompletion?: {
    completed: boolean
  }
}

interface Unit {
  id: string
  title: string
  unitIndex: number
  lessons: Lesson[]
  userProgress?: {
    isUnlocked: boolean
    completed: boolean
    progress: number
  }
}

interface Chapter {
  id: string
  title: string
  levelIndex: number
  units: Unit[]
}

// --- Helper Functions ---

// Transform lessons into level nodes for the learning path
function transformLessonsToLevels(lessons: Lesson[]): LevelNode[] {
  let foundFirstIncomplete = false

  return lessons.map((lesson) => {
    const isCompleted = lesson.userCompletion?.completed ?? false

    let status: LevelStatus
    if (isCompleted) {
      status = "completed"
    } else if (!foundFirstIncomplete) {
      status = "active"
      foundFirstIncomplete = true
    } else {
      status = "locked"
    }

    return {
      id: lesson.id,
      status,
      type: "lesson" as const,
      title: lesson.title,
      lessonId: lesson.id,
    }
  })
}

// Build unit data with lessons as levels
function buildUnitData(unit: Unit, chapterTitle: string): UnitData {
  return {
    id: unit.id,
    title: unit.title,
    description: chapterTitle,
    color: "#58cc02",
    levels: transformLessonsToLevels(unit.lessons),
  }
}

// --- Components ---

interface TopBarProps {
  streak: number
  xp: number
  hearts: number
}

const TopBar = ({ streak, xp, hearts }: TopBarProps) => (
  <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b-2 border-border h-16">
    <div className="container max-w-md mx-auto h-full flex items-center justify-between px-4">
      {/* Language Flag */}
      <div className="cursor-pointer hover:bg-muted p-2 rounded-xl transition-colors">
        <div className="relative w-8 h-6 overflow-hidden rounded-md ring-2 ring-border">
          <Image
            src="/diverse-flags.png"
            alt="Language"
            width={32}
            height={24}
            className="object-cover"
            style={{ objectPosition: "0 0" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-orange-500 font-bold px-2 py-1 hover:bg-muted rounded-xl cursor-pointer">
          <Zap className="w-5 h-5 fill-current" />
          <span>{streak}</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-400 font-bold px-2 py-1 hover:bg-muted rounded-xl cursor-pointer">
          <div className="w-5 h-5 rounded-md border-2 border-blue-400 bg-blue-400/20" />
          <span>{xp}</span>
        </div>
        <div className="flex items-center gap-1.5 text-red-500 font-bold px-2 py-1 hover:bg-muted rounded-xl cursor-pointer">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>{hearts}</span>
        </div>
      </div>
    </div>
  </header>
)

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t-2 border-border h-20 pb-4">
    <div className="container max-w-md mx-auto h-full flex items-center justify-between px-2">
      <NavItem icon={Home} active />
      <NavItem icon={Target} />
      <NavItem icon={Shield} />
      <NavItem icon={User} />
      <NavItem icon={Bell} />
    </div>
  </nav>
)

const NavItem = ({ icon: Icon, active }: { icon: LucideIcon; active?: boolean }) => (
  <button className="flex-1 h-full flex items-center justify-center p-2 relative group">
    {active && (
      <div className="absolute top-2 bottom-2 left-2 right-2 bg-blue-50/50 rounded-xl border-2 border-blue-200 pointer-events-none" />
    )}
    <Icon
      className={cn(
        "w-7 h-7 transition-colors",
        active ? "text-blue-500 fill-blue-500" : "text-muted-foreground group-hover:text-blue-400",
      )}
      strokeWidth={2.5}
    />
  </button>
)

interface ChapterNavigationProps {
  currentIndex: number
  totalChapters: number
  onPrev: () => void
  onNext: () => void
}

const ChapterNavigation = ({ currentIndex, totalChapters, onPrev, onNext }: ChapterNavigationProps) => (
  <div className="flex items-center justify-between px-4 py-2 bg-[#46a302]">
    <button
      onClick={onPrev}
      disabled={currentIndex === 0}
      className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronLeft className="w-6 h-6 text-white" />
    </button>
    <span className="text-white font-semibold">
      Chapter {currentIndex + 1} of {totalChapters}
    </span>
    <button
      onClick={onNext}
      disabled={currentIndex === totalChapters - 1}
      className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronRight className="w-6 h-6 text-white" />
    </button>
  </div>
)

interface UnitNavigationProps {
  currentIndex: number
  totalUnits: number
  onPrev: () => void
  onNext: () => void
}

const UnitNavigation = ({ currentIndex, totalUnits, onPrev, onNext }: UnitNavigationProps) => (
  <div className="flex items-center justify-between px-4 py-2 bg-[#3d8f02]">
    <button
      onClick={onPrev}
      disabled={currentIndex === 0}
      className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronLeft className="w-5 h-5 text-white" />
    </button>
    <span className="text-white font-medium text-sm">
      Unit {currentIndex + 1} of {totalUnits}
    </span>
    <button
      onClick={onNext}
      disabled={currentIndex === totalUnits - 1}
      className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronRight className="w-5 h-5 text-white" />
    </button>
  </div>
)

// --- Main Content Component ---

function LearnContent() {
  const { user, isLoading: authLoading } = useAuth()
  const languageId = user?.selectedLanguageId || ""

  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0)

  // Get current chapter and unit
  const currentChapter = chapters[currentChapterIndex]
  const units = currentChapter?.units || []
  const currentUnit = units[currentUnitIndex]

  useEffect(() => {
    const loadChapters = async () => {
      if (!languageId) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/chapters?languageId=${languageId}`)
        if (!res.ok) {
          throw new Error("Failed to load chapters")
        }

        const data = await res.json()
        setChapters(data.chapters || [])

        // Find the first chapter with incomplete units and first incomplete unit
        if (data.chapters && data.chapters.length > 0) {
          const activeChapterIdx = data.chapters.findIndex(
            (ch: Chapter) => ch.units.some((u: Unit) => !u.userProgress?.completed)
          )
          const chapterIdx = activeChapterIdx >= 0 ? activeChapterIdx : 0
          setCurrentChapterIndex(chapterIdx)

          // Find first incomplete unit in that chapter
          const chapterUnits = data.chapters[chapterIdx]?.units || []
          const activeUnitIdx = chapterUnits.findIndex(
            (u: Unit) => !u.userProgress?.completed
          )
          setCurrentUnitIndex(activeUnitIdx >= 0 ? activeUnitIdx : 0)
        }
      } catch (err) {
        console.error("Error loading chapters:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      loadChapters()
    }
  }, [languageId, authLoading])

  const handlePrevChapter = () => {
    setCurrentChapterIndex((prev) => Math.max(0, prev - 1))
    setCurrentUnitIndex(0) // Reset unit index when changing chapter
  }

  const handleNextChapter = () => {
    setCurrentChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1))
    setCurrentUnitIndex(0) // Reset unit index when changing chapter
  }

  const handlePrevUnit = () => {
    setCurrentUnitIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNextUnit = () => {
    setCurrentUnitIndex((prev) => Math.min(units.length - 1, prev + 1))
  }

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#58cc02] mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your learning path...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#58cc02] text-white rounded-xl font-bold hover:bg-[#46a302] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // No language selected
  if (!languageId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-xl font-bold text-foreground mb-2">No Language Selected</h2>
          <p className="text-muted-foreground mb-4">Please complete onboarding to select a language.</p>
          <button
            onClick={() => (window.location.href = "/onboarding")}
            className="px-4 py-2 bg-[#58cc02] text-white rounded-xl font-bold hover:bg-[#46a302] transition-colors"
          >
            Start Onboarding
          </button>
        </div>
      </div>
    )
  }

  // No chapters found
  if (chapters.length === 0 || !currentChapter || !currentUnit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-foreground mb-2">No Lessons Found</h2>
          <p className="text-muted-foreground">The learning path hasn&apos;t been set up yet.</p>
        </div>
      </div>
    )
  }

  const unitData = buildUnitData(currentUnit, currentChapter.title)
  const nextUnit = units[currentUnitIndex + 1]

  const handleLessonClick = (level: LevelNode) => {
    if (level.lessonId) {
      window.location.href = `/lessons/${level.lessonId}?languageId=${languageId}`
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar
        streak={user?.streak || 0}
        xp={user?.xp || 0}
        hearts={user?.hearts || 5}
      />

      <div className="max-w-full mx-auto bg-background min-h-screen border-x-2 border-border/50 shadow-sm relative">
        <div className="sticky top-16 z-40 bg-[#58cc02]">
          <div className="text-center text-white/90 font-bold uppercase text-sm tracking-widest pt-2">
            {currentChapter.title}
          </div>
          <UnitHeader unit={unitData} />
          <ChapterNavigation
            currentIndex={currentChapterIndex}
            totalChapters={chapters.length}
            onPrev={handlePrevChapter}
            onNext={handleNextChapter}
          />
          <UnitNavigation
            currentIndex={currentUnitIndex}
            totalUnits={units.length}
            onPrev={handlePrevUnit}
            onNext={handleNextUnit}
          />
        </div>

        <div className="py-8 relative z-0">
          <LearningPath unit={unitData} onLevelClick={handleLessonClick} />

          {/* Preview of next unit */}
          {nextUnit && (
            <div className="mt-12 border-t-2 border-border pt-8 px-4 opacity-50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-muted-foreground">{nextUnit.title}</h3>
                <div className="text-muted-foreground">Next Unit</div>
              </div>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-[#e5e5e5] bg-[#e5e5e5] flex items-center justify-center">
                  <Lock className="text-[#afafaf]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

// --- Page ---

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#58cc02]" />
        </div>
      }
    >
      <LearnContent />
    </Suspense>
  )
}
