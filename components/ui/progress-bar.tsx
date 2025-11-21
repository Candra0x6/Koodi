"use client"

import { cn } from "@/lib/utils"

export const ProgressBar = ({
  value,
  max = 100,
  className,
  color = "bg-primary",
}: { value: number; max?: number; className?: string; color?: string }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn("h-4 w-full bg-border rounded-full overflow-hidden relative", className)}>
      <div className="absolute top-1 left-2 right-2 h-1.5 bg-white/20 rounded-full z-10" />
      <div
        className={cn("h-full transition-all duration-500 ease-out rounded-full relative", color)}
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute top-1 left-2 right-2 h-1.5 bg-white/30 rounded-full" />
      </div>
    </div>
  )
}
