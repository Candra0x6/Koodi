"use client"

import { Heart, X } from "lucide-react"
import { cn } from "@/lib/utils"

export const Stepper = ({ steps, currentStep }: { steps: number; currentStep: number }) => (
  <div className="flex items-center gap-2 w-full">
    <button className="text-muted-foreground hover:bg-muted p-2 rounded-full">
      <X className="w-6 h-6" />
    </button>
    <div className="flex-1 h-4 bg-border rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-500 ease-out rounded-full relative"
        style={{ width: `${(currentStep / steps) * 100}%` }}
      >
        <div className="absolute top-1 left-2 right-2 h-1.5 bg-white/30 rounded-full" />
      </div>
    </div>
    <div className="flex items-center gap-1 text-red-500 font-bold">
      <Heart className="w-6 h-6 fill-current" />
      <span>5</span>
    </div>
  </div>
)
