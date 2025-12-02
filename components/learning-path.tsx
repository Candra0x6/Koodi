"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Check, Lock, Star, BookOpen, FastForward } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
  lessonIndex?: number // Index of first incomplete lesson
  levelIndex?: number // Index of level in the path
}

export interface UnitData {
  id: string
  title: string
  description: string
  color: string
  levels: LevelNode[]
}

// --- Constants ---

const PATH_AMPLITUDE = 100 // Horizontal sway amount
const LEVEL_HEIGHT = 130 // Vertical distance between levels
const START_OFFSET = 0 // Initial vertical padding

// --- Components ---

const PathNode = ({
  level,
  index,
  total,
  xOffset,
  onNodeClick,
  openTooltip,
  setOpenTooltip,
}: {
  level: LevelNode
  index: number
  total: number
  xOffset: number
  onNodeClick?: (level: LevelNode) => void
  openTooltip: string | null
  setOpenTooltip: (id: string | null) => void
  tooltipLevel?: number
}) => {
  const isActive = level.status === "active"
  const isLocked = level.status === "locked"
  const isCompleted = level.status === "completed"
  const isChest = level.type === "chest"
  const isClickable = !isLocked
  const showTooltip = openTooltip === level.id

  // Node Colors - Green for completed, bright green for active, gray for locked
  const bgColor = isCompleted
    ? "bg-primary"
    : isActive
      ? "bg-primary"
      : isLocked
        ? "bg-border"
        : isChest
          ? "bg-transparent"
          : "bg-accent"

  const borderColor = isActive
    ? "border-primary-depth" // Darker green
    : isLocked
      ? "border-muted" // Darker gray
      : "border-primary-depth" // Darker yellow

  const iconColor = isActive ? "text-white" : isLocked ? "text-muted-foreground" : "text-white"
  console.log(level)
  return (
    <div
      className="absolute flex justify-center items-center w-full"
      style={{ top: index * LEVEL_HEIGHT + START_OFFSET }}
    >
      <div className="relative z-10" style={{ transform: `translateX(${xOffset}px)` }}>
        {/* Floating Start Tooltip for Active Node isActive and first lesson and chapter */}
        {isActive && index === 0 && (level.levelIndex ?? 0) === 1  && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: [0, -8, 0], opacity: 1 }}
            transition={{
              y: { repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" },
              opacity: { duration: 0.3 },
            }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-primary font-extrabold text-sm py-2 px-3 rounded-xl shadow-lg border-2 border-border uppercase tracking-widest whitespace-nowrap z-20"
          >
            Start
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 bg-white border-r-2 border-b-2 border-border rotate-45 transform" />
          </motion.div>
        ) }
        
        {

          index === 0 && level.status === "active"  && (level.levelIndex ?? 0) > 1 && (
            
           <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: [0, -8, 0], opacity: 1 }}
            transition={{
              y: { repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" },
              opacity: { duration: 0.3 },
            }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-primary font-extrabold text-sm py-2 px-3 rounded-xl shadow-lg border-2 border-border uppercase tracking-widest whitespace-nowrap z-20"
          >
            Skip 
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 bg-white border-r-2 border-b-2 border-border rotate-45 transform" />
          </motion.div>
        )
        }

        {/* The Node Button */}
        <div className="relative group">
          {/* Progress Ring for Active Node */}
          {/* {isActive && (
            <motion.div
              className="absolute -inset-2 rounded-full border-[6px] border-white z-0"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
            >
              <div className="absolute -inset-[6px] rounded-full border-[6px] border-accent border-l-transparent border-b-transparent -rotate-45" />
            </motion.div>
          )} */}
          <motion.button
            onClick={() => {
              if (isClickable) {
                setOpenTooltip(showTooltip ? null : level.id)
              }
            }}
            disabled={isLocked}
            animate={isActive ? { y: [0, -3, 0] } : {}}
            transition={isActive ? { repeat: Number.POSITIVE_INFINITY, duration: 0.5, ease: "linear", repeatDelay: 1.5 } : {}}
            whileTap={!isLocked ? { scale: 0.95, y: 4 } : {}}
            className={cn(
              "w-21 h-20 rounded-full active:translate-y-[4px] active:border-b-0 flex items-center justify-center transition-colors duration-500 p-2",
              bgColor,
              `border-b-8 ${borderColor}`,
              isActive ? "shadow-[0_0_0_8px_rgba(255,255,255,0.5)]" : "",
              isChest && "w-20 h-20 border-0 bg-transparent active:scale-95 overflow-visible",
              isClickable && "cursor-pointer hover:scale-105 hover:brightness-110",
              isLocked && "cursor-not-allowed",
            )}
          >
                
            <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden relative">

              <div className={iconColor}>
                {level.type === "chest" ? (
                  <div className={cn("relative w-16 h-16 drop-shadow-sm filter", isLocked ? "grayscale opacity-60" : "")}>
                    {/* Use Next.js Image for better handling */}
                    <h1 className="text-4xl">🎁</h1>
                  </div>

                ) : level.type === "book" ? (
                  <BookOpen className={cn("w-8 h-8", iconColor)} strokeWidth={3} />
                ) : level.status === "active" ? (
                  // Jumping Star animation for active lesson rotated, make delay every loop
                  <motion.div className="" animate={{ y:[0, -6, 0]}} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5, ease: "linear", repeatDelay: 0.5 }}>

{          index === 0 && (level.levelIndex ?? 0) < 2 ?          <Star className="w-8 h-8 text-white fill-white" /> : <FastForward className="h-8 w-8 text-white fill-white" />
}                  </motion.div>
                ) : level.status === "locked" ? (
                  <Lock className="w-6 h-6 text-muted-foreground" strokeWidth={3} />
                ) : (
                  <Check className="w-8 h-8 text-white stroke-[4]" />
                )}
              </div>

              {/* Shine effect overlay */}
              <div className="absolute -top-5 left-0 w-7 h-20 bg-white opacity-20 rounded-full rotate-[40deg]"></div>
              <div className="absolute -top-3 left-10 w-2 h-20 bg-white opacity-20 rounded-full rotate-40"></div>
            </div>
          </motion.button>
        </div>

        {/* Floating Companion Character (next to specific nodes) */}
        {index === 2 && (
          <motion.div
            className="absolute left-24 top-0 pointer-events-none"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
          >
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
    <div className={cn("bg-primary text-primary-foreground p-4 rounded-b-none sticky top-16 z-30", className)}>
      <div className="container mx-auto max-w-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold uppercase tracking-wide opacity-90">{unit.title}</h2>
          <p className="text-lg font-bold">{unit.description}</p>
        </div>
        <Button variant="secondary" className="bg-primary border-primary-depth hover:bg-primary-depth px-3 rounded-2xl text-primary-foreground">
          <BookOpen className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  )
}

export const LearningPath = ({ 
  unit, 
  onLevelClick,
  openTooltip: globalOpenTooltip,
  setOpenTooltip: globalSetOpenTooltip,
}: { 
  unit: UnitData
  onLevelClick?: (level: LevelNode) => void
  openTooltip?: string | null
  setOpenTooltip?: (id: string | null) => void
}) => {
  // Use global state if provided, otherwise use local state
  const [localOpenTooltip, setLocalOpenTooltip] = useState<string | null>(null)
  const openTooltip = globalOpenTooltip ?? localOpenTooltip
  const setOpenTooltip = globalSetOpenTooltip ?? setLocalOpenTooltip
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

  // Find the level with open tooltip to render portal
  const openLevel = openTooltip ? unit.levels.find(l => l.id === openTooltip) : null
  const openLevelIndex = openTooltip ? unit.levels.findIndex(l => l.id === openTooltip) : -1
  const isOpenLevelClickable = openLevel ? openLevel.status !== "locked" : false
  
  // Calculate X offset for the button (same formula as in PathNode)
  const buttonXOffset = openLevelIndex >= 0 ? Math.sin(openLevelIndex * 0.8) * PATH_AMPLITUDE : 0
  return (
    <div className={`relative w-full max-w-[300px] mx-auto ${unit.levels[0]?.levelIndex !== 1 ? "" : "mt-20"}`} style={{ height: totalHeight }}>
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
          openTooltip={openTooltip}
          setOpenTooltip={setOpenTooltip}
        />
      ))}

      {/* Global Tooltip Portal - Outside Stacking Context */}
      {openLevel && isOpenLevelClickable && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="absolute bg-white rounded-2xl shadow-2xl border-2 border-primary p-4 w-56 z-50 pointer-events-auto"
          style={{ 
            top: `${openLevelIndex * LEVEL_HEIGHT + START_OFFSET + 90}px`,
            left: `calc(50% + ${buttonXOffset}px - 112px)`
          }}
        >
          {/* Arrow pointing to button */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-primary rotate-45"></div>

          {/* Content */}
          <div className="text-center">
            <h3 className="font-bold text-primary text-lg mb-2">{openLevel.title}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {openLevel.status === "completed" ? "Completed! Great job! 🎉" : "Ready to start this lesson?"}
            </p>

            {/* Start/Resume Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onLevelClick?.(openLevel)
                setOpenTooltip(null)
              }}
              className="w-full bg-primary text-primary-foreground font-bold py-2 px-4 rounded-xl hover:bg-primary-depth transition-colors flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4" />
              {openLevel.status === "completed" ? "Review" : "Start Lesson"}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
