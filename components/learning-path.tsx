"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Check, Lock, Star, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/duolingo-ui"
import Image from "next/image"

// --- Types ---

export type LevelStatus = "locked" | "active" | "completed" | "chest"

export interface LevelNode {
  id: string
  status: LevelStatus
  icon?: React.ReactNode
  type: "lesson" | "chest" | "book"
  position?: number // -1 (left) to 1 (right)
  title?: string
  lessonId?: string // ID of first incomplete lesson to navigate to
}

export interface UnitData {
  id: string
  title: string
  description: string
  color: string
  levels: LevelNode[]
}

// --- Constants ---

const PATH_AMPLITUDE = 60 // Horizontal sway amount
const LEVEL_HEIGHT = 100 // Vertical distance between levels
const START_OFFSET = 50 // Initial vertical padding

// --- Components ---

const PathNode = ({
  level,
  index,
  total,
  xOffset,
  onNodeClick,
}: {
  level: LevelNode
  index: number
  total: number
  xOffset: number
  onNodeClick?: (level: LevelNode) => void
}) => {
  const isActive = level.status === "active"
  const isLocked = level.status === "locked"
  const isCompleted = level.status === "completed"
  const isChest = level.type === "chest"
  const isClickable = !isLocked

  // Node Colors - Green for completed, bright green for active, gray for locked
  const bgColor = isCompleted
    ? "bg-[#58cc02]"
    : isActive
      ? "bg-[#58cc02]"
      : isLocked
        ? "bg-[#e5e5e5]"
        : isChest
          ? "bg-transparent"
          : "bg-[#ffc800]"

  const borderColor = isActive
    ? "border-[#46a302]" // Darker green
    : isLocked
      ? "border-[#cecece]" // Darker gray
      : "border-transparent"

  const iconColor = isActive ? "text-white" : isLocked ? "text-[#afafaf]" : "text-white"

  return (
    <div
      className="absolute flex justify-center items-center w-full"
      style={{ top: index * LEVEL_HEIGHT + START_OFFSET }}
    >
      <div className="relative z-10" style={{ transform: `translateX(${xOffset}px)` }}>
        {/* Floating Start Tooltip for Active Node */}
        {isActive && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: [0, -8, 0], opacity: 1 }}
            transition={{
              y: { repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" },
              opacity: { duration: 0.3 },
            }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-[#58cc02] font-extrabold text-sm py-2 px-3 rounded-xl shadow-lg border-2 border-border uppercase tracking-widest whitespace-nowrap z-20"
          >
            Start
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 bg-white border-r-2 border-b-2 border-border rotate-45 transform" />
          </motion.div>
        )}

        {/* The Node Button */}
        <div className="relative group">
          {/* Progress Ring for Active Node */}
          {isActive && (
            <div className="absolute -inset-2 rounded-full border-[6px] border-[#e5e5e5] z-0">
              <div className="absolute -inset-[6px] rounded-full border-[6px] border-[#ffc800] border-l-transparent border-b-transparent -rotate-45" />
            </div>
          )}

          <button
            onClick={() => isClickable && onNodeClick?.(level)}
            disabled={isLocked}
            className={cn(
              "relative w-16 h-16 rounded-full flex items-center justify-center border-b-4 active:border-b-0 active:translate-y-[4px] transition-all duration-100 z-10 overflow-hidden",
              bgColor,
              borderColor,
              isChest && "w-20 h-20 border-0 bg-transparent active:scale-95 overflow-visible",
              isClickable && "cursor-pointer hover:scale-105 hover:brightness-110",
              isLocked && "cursor-not-allowed",
            )}
          >
            {level.type === "chest" ? (
              <div className={cn("relative w-16 h-16 drop-shadow-sm filter", isLocked ? "grayscale opacity-60" : "")}>
                {/* Use Next.js Image for better handling */}
<h1 className="text-4xl">🎁</h1>
              </div>
              
            ) : level.type === "book" ? (
              <BookOpen className={cn("w-8 h-8", iconColor)} strokeWidth={3} />
            ) : level.status === "active" ? (
              <Star className="w-8 h-8 text-white fill-white" />
            ) : level.status === "locked" ? (
              <Lock className="w-6 h-6 text-[#afafaf]" strokeWidth={3} />
            ) : (
              <Check className="w-8 h-8 text-white stroke-[4]" />
            )}
          </button>
        </div>

        {/* Floating Companion Character (next to specific nodes) */}
        {index === 2 && (
          <motion.div
            className="absolute left-24 top-0 pointer-events-none"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
          >
            <div className="relative w-24 h-24 opacity-30 grayscale">
              <Image src="/majestic-owl.png" alt="Duo" width={96} height={96} className="object-contain" />
            </div>
            <div className="flex gap-1 justify-center mt-2 opacity-30">
              <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
              <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
              <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export const UnitHeader = ({ unit, className }: { unit: UnitData; className?: string }) => {
  return (
    <div className={cn("bg-[#58cc02] text-white p-4 rounded-b-none sticky top-16 z-30", className)}>
      <div className="container mx-auto max-w-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold uppercase tracking-wide opacity-90">{unit.title}</h2>
          <p className="text-lg font-bold">{unit.description}</p>
        </div>
        <Button variant="secondary" className="bg-[#58cc02] border-[#46a302] hover:bg-[#46a302] px-3 rounded-2xl">
          <BookOpen className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  )
}

export const LearningPath = ({ unit, onLevelClick }: { unit: UnitData; onLevelClick?: (level: LevelNode) => void }) => {
  const totalHeight = unit.levels.length * LEVEL_HEIGHT + START_OFFSET * 2

  // Generate path points for SVG
  const pathPoints = unit.levels.map((_, i) => {
    const x = Math.sin(i * 0.8) * PATH_AMPLITUDE // 0.8 controls frequency
    const y = i * LEVEL_HEIGHT + START_OFFSET
    return { x, y }
  })

  // Create SVG path string
  const generateSvgPath = () => {
    if (pathPoints.length === 0) return ""

    let d = `M ${pathPoints[0].x + 150} ${pathPoints[0].y}` // Center is roughly 150 (half of 300 width container)

    for (let i = 0; i < pathPoints.length - 1; i++) {
      const current = pathPoints[i]
      const next = pathPoints[i + 1]

      // Control points for bezier curve
      const cp1x = current.x + 150
      const cp1y = current.y + LEVEL_HEIGHT * 0.5
      const cp2x = next.x + 150
      const cp2y = next.y - LEVEL_HEIGHT * 0.5

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x + 150} ${next.y}`
    }

    return d
  }

  // Generate path segment for specific range (for coloring completed segments green)
  const generateSvgPathSegment = (startIdx: number, endIdx: number) => {
    if (pathPoints.length === 0 || startIdx >= endIdx) return ""

    let d = `M ${pathPoints[startIdx].x + 150} ${pathPoints[startIdx].y}`

    for (let i = startIdx; i < endIdx && i < pathPoints.length - 1; i++) {
      const current = pathPoints[i]
      const next = pathPoints[i + 1]

      const cp1x = current.x + 150
      const cp1y = current.y + LEVEL_HEIGHT * 0.5
      const cp2x = next.x + 150
      const cp2y = next.y - LEVEL_HEIGHT * 0.5

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x + 150} ${next.y}`
    }

    return d
  }

  // Find the last completed index for green path
  const lastCompletedIndex = unit.levels.reduce((acc, level, idx) => {
    return level.status === "completed" ? idx : acc
  }, -1)

  return (
    <div className="relative w-full max-w-[300px] mx-auto" style={{ height: totalHeight }}>
      {/* SVG Path Background (gray) */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox={`0 0 300 ${totalHeight}`}
      >
        <path
          d={generateSvgPath()}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Green path overlay for completed segments */}
        {lastCompletedIndex >= 0 && (
          <path
            d={generateSvgPathSegment(0, lastCompletedIndex + 1)}
            fill="none"
            stroke="#58cc02"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* Nodes */}
      {unit.levels.map((level, i) => (
        <PathNode
          key={level.id}
          level={level}
          index={i}
          total={unit.levels.length}
          xOffset={Math.sin(i * 0.8) * PATH_AMPLITUDE}
          onNodeClick={onLevelClick}
        />
      ))}
    </div>
  )
}
