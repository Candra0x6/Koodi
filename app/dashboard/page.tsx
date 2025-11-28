"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Home, Zap, Target, Shield, User, Bell, Lock, ChevronLeft, ChevronRight, Loader2, Laptop, Book, Trophy } from "lucide-react"
import { UnitHeader, type UnitData, type LevelNode, type LevelStatus, LearningPath } from "@/components/learning-path"
import { useAuth } from "@/lib/hooks/use-auth"
import Image from "next/image"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import BottomNavigation from "@/components/navigation/bottom-navigation-mobile"

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
    levels: transformLessonsToLevels(unit.lessons).map((level, index) => ({
      ...level,
      lessonIndex: index,
      levelIndex: unit.unitIndex,
    })),
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
    <>
      <div className="flex px-10 space-x-10 items-center justify-center">

        <div className={`px-4 h-2 bg-gray-300 rounded-full flex-1 ${unit.unitIndex === 1 ? "hidden" : ""}`} />
        <h1 className=" text-center font-black ">{unit.unitIndex === 1 ? "" : unit.title}</h1>
        <div className={`px-4 h-2 bg-gray-300 rounded-full flex-1 ${unit.unitIndex === 1 ? "hidden" : ""}`} />
      </div>
      <div ref={setRef} className={`pt-8 pb-12`} data-unit-index={unitIndex} data-chapter-title={chapterTitle}>

        {/* Learning Path */}
        <div className={`flex justify-center ${unitIndex !== 0 ? "mt-20" : ""}`}>
          <LearningPath unit={unitData} onLevelClick={(level) => {
            if (level.lessonId) {
              onLessonClick(level.lessonId)
            }
          }} />
        </div>
      </div>
    </>
  )
}

// --- Main Content Component ---

function LearnContent() {
  const { user, isLoading: authLoading } = useAuth()
  const languageId = user?.selectedLanguageId || ""
  const pathname = usePathname()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [isChapterListOpen, setIsChapterListOpen] = useState(false)

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

      <div className="max-w-full mx-auto bg-background min-h-screen relative">
        {/* Sticky Chapter Header and Navigation */}
        <div className="sticky top-16 z-40">
          <Button
            onClick={() => setIsChapterListOpen(!isChapterListOpen)}
            className={cn(
              "rounded-xl w-full p-5 flex justify-between items-center h-22 transition-colors duration-300 border-b-4",
              currentHeaderColor.bg,
              currentHeaderColor.border
            )}
          >
            <div className="flex-1 text-left text-white/90 font-bold uppercase text-sm tracking-widest py-3">
              <h2 className="text-[13px] opacity-80">CHAPTER {currentChapterIndex + 1}</h2>
              <h1 className="text-white text-base">{activeUnit?.unitTitle || currentChapter?.title || "Loading..."}</h1>
            </div>

            <div className="flex items-center h-full px-2">
              <Book className="text-white w-6 h-6" />
            </div>
          </Button>

          <AnimatePresence>
            {isChapterListOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsChapterListOpen(false)}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                />
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-2xl shadow-xl z-50 overflow-hidden max-h-[60vh] flex flex-col"
                >
                  <div className="p-4 bg-muted/50 border-b-2 border-border">
                    <h3 className="font-bold text-lg text-foreground">Select a Chapter</h3>
                  </div>
                  <div className="overflow-y-auto p-2 space-y-2">
                    {chapters.map((chapter, index) => (
                      <button
                        key={chapter.id}
                        onClick={() => {
                          setCurrentChapterIndex(index)
                          setIsChapterListOpen(false)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className={cn(
                          "w-full text-left p-4 rounded-xl transition-all border-2 border-transparent hover:bg-muted flex items-center gap-4 group",
                          currentChapterIndex === index
                            ? "bg-blue-50 border-blue-200"
                            : "hover:border-border"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border-b-4 transition-transform group-active:translate-y-[2px] group-active:border-b-2",
                          currentChapterIndex === index
                            ? "bg-primary text-white border-green-700"
                            : "bg-muted text-muted-foreground border-gray-300"
                        )}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className={cn(
                            "font-black text-sm uppercase tracking-wider mb-1",
                            currentChapterIndex === index ? "text-primary" : "text-muted-foreground"
                          )}>
                            Chapter {index + 1}
                          </h4>
                          <p className="font-bold text-foreground">{chapter.title}</p>
                        </div>
                        {currentChapterIndex === index && (
                          <div className="text-blue-500">
                            <div className="w-3 h-3 bg-current rounded-full" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

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
