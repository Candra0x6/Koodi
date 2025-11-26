"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Home, Zap, Target, Shield, User, Bell, Lock, ChevronLeft, ChevronRight, Loader2, Laptop } from "lucide-react"
import { UnitHeader, type UnitData, type LevelNode, type LevelStatus, LearningPath } from "@/components/learning-path"
import { useAuth } from "@/lib/hooks/use-auth"
import Image from "next/image"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

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
function buildUnitData(unit: Unit, chapterTitle: string, color: string): UnitData {
  return {
    id: unit.id,
    title: unit.title,
    description: chapterTitle,
    color: color,
    levels: transformLessonsToLevels(unit.lessons),
  }
}

// --- Constants ---

const UNIT_COLORS = [
  { bg: "bg-[#58cc02]", border: "border-[#46a302]", text: "text-[#58cc02]", hex: "#58cc02" }, // Green
  { bg: "bg-[#ce82ff]", border: "border-[#a568cc]", text: "text-[#ce82ff]", hex: "#ce82ff" }, // Purple
  { bg: "bg-[#00cd9c]", border: "border-[#00a47d]", text: "text-[#00cd9c]", hex: "#00cd9c" }, // Teal
  { bg: "bg-[#ff9600]", border: "border-[#cc7800]", text: "text-[#ff9600]", hex: "#ff9600" }, // Orange
  { bg: "bg-[#ff4b4b]", border: "border-[#cc3c3c]", text: "text-[#ff4b4b]", hex: "#ff4b4b" }, // Red
  { bg: "bg-[#1cb0f6]", border: "border-[#168dbd]", text: "text-[#1cb0f6]", hex: "#1cb0f6" }, // Blue
]

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

interface UnitSectionProps {
  unit: Unit
  chapterTitle: string
  unitIndex: number
  languageId: string
  onLessonClick: (lessonId: string) => void
  color: typeof UNIT_COLORS[0]
  setRef: (el: HTMLDivElement | null) => void
}

const UnitSection = ({ unit, chapterTitle, unitIndex, languageId, onLessonClick, color, setRef }: UnitSectionProps) => {
  const unitData = buildUnitData(unit, chapterTitle, color.hex)

  return (
    <div ref={setRef} className="border-t-2 border-border pt-8 pb-12" data-unit-index={unitIndex} data-chapter-title={chapterTitle}>
      {/* Unit Header */}
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className={cn("text-2xl font-bold", color.text)}>Unit {unitIndex + 1}</h2>
          <p className="text-muted-foreground font-bold text-lg">{unit.title}</p>
        </div>
        <p className="text-muted-foreground">{chapterTitle}</p>
      </div>

      {/* Learning Path */}
      <div className="flex justify-center">
        <LearningPath unit={unitData} onLevelClick={(level) => {
          if (level.lessonId) {
            onLessonClick(level.lessonId)
          }
        }} />
      </div>
    </div>
  )
}

// --- Main Content Component ---

function LearnContent() {
  const { user, isLoading: authLoading } = useAuth()
  const languageId = user?.selectedLanguageId || ""

  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  
  // State for sticky header
  const [activeUnit, setActiveUnit] = useState<{
    unitIndex: number
    chapterTitle: string
    unitTitle: string
    color: typeof UNIT_COLORS[0]
  } | null>(null)

  const unitRefs = useRef<(HTMLDivElement | null)[]>([])

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

        // Find the first chapter with incomplete units
        if (data.chapters && data.chapters.length > 0) {
          const activeChapterIdx = data.chapters.findIndex(
            (ch: Chapter) => ch.units.some((u: Unit) => !u.userProgress?.completed)
          )
          const chapterIdx = activeChapterIdx >= 0 ? activeChapterIdx : 0
          setCurrentChapterIndex(chapterIdx)
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

  // Scroll spy logic
  useEffect(() => {
    const handleScroll = () => {
      if (unitRefs.current.length === 0) return

      // Find the unit that is currently active (closest to top but not fully scrolled past)
      // We want the unit whose top is <= headerOffset (e.g. 120px)
      // But we want the *last* such unit.
      
      const headerOffset = 140 // Adjust based on header height + sticky offset
      
      let currentActiveIndex = -1
      
      for (let i = 0; i < unitRefs.current.length; i++) {
        const ref = unitRefs.current[i]
        if (!ref) continue
        
        const rect = ref.getBoundingClientRect()
        
        // If the top of the unit is above the "trigger line", it's a candidate
        if (rect.top <= headerOffset) {
          currentActiveIndex = i
        } else {
          // Since units are ordered, once we find one below the line, we can stop?
          // Actually, we want the last one that is <= headerOffset.
          // So we continue until we find one > headerOffset, then break.
          break
        }
      }

      if (currentActiveIndex !== -1) {
        // We need to map this global index back to chapter/unit data
        // We can store the data in the ref or recalculate
        // Let's recalculate for simplicity or use data attributes
        const ref = unitRefs.current[currentActiveIndex]
        if (ref) {
           // We can't easily get data from DOM unless we put it there.
           // Better to compute the flattened list of units first.
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener("scroll", handleScroll)
  }, [chapters, currentChapterIndex]) // Re-run when chapters change

  const currentChapter = chapters[currentChapterIndex]

  // Get units for current chapter
  const displayedUnits = currentChapter ? currentChapter.units.map((unit) => ({
      ...unit,
      chapterTitle: currentChapter.title,
      chapterLevel: currentChapter.levelIndex
    })) : []

  // Update active unit based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headerOffset = 180 // Sticky header bottom position approx
      
      let activeIndex = 0
      
      unitRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect()
          if (rect.top < headerOffset) {
            activeIndex = index
          }
        }
      })
      
      if (displayedUnits[activeIndex]) {
        const unit = displayedUnits[activeIndex]
        const color = UNIT_COLORS[activeIndex % UNIT_COLORS.length]
        
        setActiveUnit({
          unitIndex: activeIndex + 1,
          chapterTitle: unit.chapterTitle,
          unitTitle: unit.title,
          color
        })
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial set
    if (displayedUnits.length > 0 && !activeUnit) {
        handleScroll()
    }
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [displayedUnits, activeUnit])

  const handlePrevChapter = () => {
    setCurrentChapterIndex((prev) => Math.max(0, prev - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNextChapter = () => {
    setCurrentChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }


  const handleLessonClick = (lessonId: string) => {
    window.location.href = `/lessons/${lessonId}?languageId=${languageId}`
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
  if (chapters.length === 0) {
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

  const currentHeaderColor = activeUnit?.color || UNIT_COLORS[0]

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar
        streak={user?.streak || 0}
        xp={user?.xp || 0}
        hearts={user?.hearts || 5}
      />

      <div className="max-w-full mx-auto bg-background min-h-screen border-x-2 border-border/50 shadow-sm relative">
        {/* Sticky Chapter Header and Navigation */}
        <Button 
          className={cn(
            "sticky top-16 z-40 rounded-none w-full p-0 flex justify-between items-center h-16 transition-colors duration-300 border-b-4",
            currentHeaderColor.bg,
            currentHeaderColor.border
          )}
        >
          <div className="flex items-center h-full px-2">
            {currentChapterIndex > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrevChapter(); }}
                className="p-2 hover:bg-black/10 rounded-xl transition-colors text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="flex-1 text-center text-white/90 font-bold uppercase text-sm tracking-widest py-3">
            <h2 className="text-[13px] opacity-80">UNIT {activeUnit?.unitIndex || 1}</h2>
            <h1 className="text-white text-base">{activeUnit?.unitTitle || currentChapter?.title || "Loading..."}</h1>
          </div>

          <div className="flex items-center h-full px-2">
             {currentChapterIndex < chapters.length - 1 ? (
              <button 
                onClick={(e) => { e.stopPropagation(); handleNextChapter(); }}
                className="p-2 hover:bg-black/10 rounded-xl transition-colors text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            ) : (
              <div className="w-10" /> // Spacer
            )}
          </div>
        </Button>

        {/* All Units on One Page */}
        <div className="py-8 relative z-0">
          {displayedUnits.map((unit, index) => (
            <UnitSection
              key={unit.id}
              unit={unit}
              chapterTitle={unit.chapterTitle}
              unitIndex={index}
              languageId={languageId}
              onLessonClick={handleLessonClick}
              color={UNIT_COLORS[index % UNIT_COLORS.length]}
              setRef={(el) => (unitRefs.current[index] = el)}
            />
          ))}
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
