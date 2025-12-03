"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Book, Loader2 } from "lucide-react"
import { UnitHeader, type UnitData, LearningPath } from "@/components/learning-path"
import { useAuth, LANGUAGE_CHANGED_EVENT } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { NoLanguageSelected, NoChaptersFound, LearnContentError } from "@/components/learn-content-skeletons"

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

function transformLessonsToLevels(lessons: Lesson[]) {
  let foundFirstIncomplete = false

  return lessons.map((lesson) => {
    const isCompleted = lesson.userCompletion?.completed ?? false

    let status: "completed" | "active" | "locked" | "chest"
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

function buildUnitData(unit: Unit, chapterTitle: string, color: string) {
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
  { bg: "bg-primary", border: "border-primary-depth", text: "text-primary", hex: "var(--primary)" },
  { bg: "bg-purple-500", border: "border-purple-700", text: "text-purple-500", hex: "#a855f7" },
  { bg: "bg-cyan-500", border: "border-cyan-700", text: "text-cyan-500", hex: "#06b6d4" },
  { bg: "bg-orange-500", border: "border-orange-700", text: "text-orange-500", hex: "#f97316" },
  { bg: "bg-destructive", border: "border-destructive-depth", text: "text-destructive", hex: "var(--destructive)" },
  { bg: "bg-secondary", border: "border-secondary-depth", text: "text-secondary", hex: "var(--secondary)" },
]

// --- Unit Section Component ---

interface UnitSectionProps {
  unit: Unit
  chapterTitle: string
  unitIndex: number
  languageId: string
  onLessonClick: (lessonId: string) => void
  color: (typeof UNIT_COLORS)[0]
  setRef: (el: HTMLDivElement | null) => void
}

function UnitSection({ unit, chapterTitle, unitIndex, languageId, onLessonClick, color, setRef }: UnitSectionProps) {
  const unitData = buildUnitData(unit, chapterTitle, color.hex)

  return (
    <>
      <div className="flex px-10 space-x-10 items-center justify-center">
        <div className={`px-4 h-2 bg-gray-300 rounded-full flex-1 ${unit.unitIndex === 1 ? "hidden" : ""}`} />
        <h1 className="text-center font-black">{unit.unitIndex === 1 ? "" : unit.title}</h1>
        <div className={`px-4 h-2 bg-gray-300 rounded-full flex-1 ${unit.unitIndex === 1 ? "hidden" : ""}`} />
      </div>
      <div ref={setRef} className="pt-8 pb-12" data-unit-index={unitIndex} data-chapter-title={chapterTitle}>
        <div className={`flex justify-center ${unitIndex !== 0 ? "mt-20" : ""}`}>
          <LearningPath
            unit={unitData}
            onLevelClick={(level) => {
              if (level.lessonId) {
                onLessonClick(level.lessonId)
              }
            }}
          />
        </div>
      </div>
    </>
  )
}

// --- Main Learn Content Component ---

export function LearnContent() {
  const { user, isLoading: authLoading } = useAuth()
  const languageId = user?.selectedLanguage?.id || ""
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [isChapterListOpen, setIsChapterListOpen] = useState(false)
  const [activeUnit, setActiveUnit] = useState<{
    unitIndex: number
    chapterTitle: string
    unitTitle: string
    color: (typeof UNIT_COLORS)[0]
  } | null>(null)

  const unitRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    unitRefs.current = []
    setActiveUnit(null)
  }, [currentChapterIndex, languageId])

  const loadChapters = useCallback(async (langId: string) => {
    if (!langId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chapters?languageId=${langId}`)
      if (!res.ok) {
        throw new Error("Failed to load chapters")
      }

      const data = await res.json()
      setChapters(data.chapters || [])

      if (data.chapters && data.chapters.length > 0) {
        const activeChapterIdx = data.chapters.findIndex((ch: Chapter) =>
          ch.units.some((u: Unit) => !u.userProgress?.completed)
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
  }, [])

  useEffect(() => {
    if (!authLoading && languageId) {
      loadChapters(languageId)
    } else if (!authLoading && !languageId) {
      setLoading(false)
    }
  }, [languageId, authLoading, loadChapters])

  useEffect(() => {
    const handleLanguageChange = async () => {
      setTimeout(async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/profile`)
        if (res.ok) {
          const userData = await res.json()
          const newLanguageId = userData.result?.selectedLanguage?.id
          if (newLanguageId) {
            loadChapters(newLanguageId)
          }
        }
      }, 100)
    }

    window.addEventListener(LANGUAGE_CHANGED_EVENT, handleLanguageChange)
    return () => {
      window.removeEventListener(LANGUAGE_CHANGED_EVENT, handleLanguageChange)
    }
  }, [loadChapters])

  // Prepare data structures BEFORE useEffect that depends on them
  const currentChapter = chapters[currentChapterIndex]
  const displayedUnits = currentChapter
    ? currentChapter.units.map((unit) => ({
        ...unit,
        chapterTitle: currentChapter.title,
        chapterLevel: currentChapter.levelIndex,
      }))
    : []

  // Update active unit based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headerOffset = 180

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

        setActiveUnit((prev) => {
          if (
            prev?.unitIndex !== activeIndex + 1 ||
            prev?.chapterTitle !== currentChapter?.title ||
            prev?.unitTitle !== unit.title
          ) {
            return {
              unitIndex: activeIndex + 1,
              chapterTitle: currentChapter?.title || "",
              unitTitle: unit.title,
              color,
            }
          }
          return prev
        })
      }
    }

    const timeoutId = setTimeout(() => {
      handleScroll()
    }, 100)

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timeoutId)
    }
  }, [displayedUnits, currentChapter])

  const handleLessonClick = (lessonId: string) => {
    window.location.href = `/lessons/${lessonId}?languageId=${languageId}`
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your learning path...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <LearnContentError error={error} />
  }

  if (!languageId) {
    return <NoLanguageSelected />
  }

  if (chapters.length === 0) {
    return <NoChaptersFound />
  }

  const currentHeaderColor = activeUnit?.color || UNIT_COLORS[0]

  return (
    <div className="min-h-screen bg-background pb-32 w-full">
      <div className="max-w-full mx-auto bg-background min-h-screen relative">
        {/* Sticky Chapter Header */}
        <div className="sticky top-10 z-40">
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
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                        className={cn(
                          "w-full text-left p-4 rounded-xl transition-all border-2 border-transparent hover:bg-muted flex items-center gap-4 group",
                          currentChapterIndex === index ? "bg-blue-50 border-blue-200" : "hover:border-border"
                        )}
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border-b-4 transition-transform group-active:translate-y-0.5 group-active:border-b-2",
                            currentChapterIndex === index
                              ? "bg-primary text-white border-primary-depth"
                              : "bg-muted text-muted-foreground border-gray-300"
                          )}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4
                            className={cn(
                              "font-black text-sm uppercase tracking-wider mb-1",
                              currentChapterIndex === index ? "text-primary" : "text-muted-foreground"
                            )}
                          >
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

        {/* All Units */}
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
