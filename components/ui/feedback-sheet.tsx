"use client"

import { Check, X, Flag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export const FeedbackSheet = ({
  status,
  isOpen,
  onNext,
  correctAnswer,
}: {
  status: "correct" | "incorrect"
  isOpen: boolean
  onNext: () => void
  correctAnswer?: string
}) => {
  if (!isOpen) return null

  const isCorrect = status === "correct"

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 p-6 border-t-2 animate-in slide-in-from-bottom-full duration-300 z-50",
        isCorrect ? "bg-[#d7ffb8] border-transparent" : "bg-[#ffdfe0] border-transparent",
      )}
    >
      <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div
            className={cn(
              "w-16 h-16 rounded-full flex shrink-0 items-center justify-center shadow-sm",
              isCorrect ? "bg-white text-[#58cc02]" : "bg-white text-[#ea2b2b]",
            )}
          >
            {isCorrect ? <Check className="w-10 h-10 stroke-4" /> : <X className="w-10 h-10 stroke-4" />}
          </div>
          <div className="flex-1">
            <h3 className={cn("text-2xl font-extrabold mb-1", isCorrect ? "text-[#58cc02]" : "text-[#ea2b2b]")}>
              {isCorrect ? "Excellent!" : "Incorrect"}
            </h3>
            {!isCorrect && correctAnswer && (
              <div className="text-[#ea2b2b] font-medium">
                Correct solution: <span className="font-bold">{correctAnswer}</span>
              </div>
            )}
            {isCorrect && <div className="text-[#58cc02] font-bold">You earned 10 XP!</div>}
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {!isCorrect && (
            <button className="p-3 rounded-2xl hover:bg-black/5 text-[#ea2b2b] transition-colors">
              <Flag className="w-6 h-6" />
            </button>
          )}
          <Button
            onClick={onNext}
            className={cn(
              "w-full md:w-auto min-w-[150px]",
              isCorrect
                ? "bg-[#58cc02] border-[#46a302] hover:bg-[#46a302] text-white"
                : "bg-[#ff4b4b] border-[#ea2b2b] hover:bg-[#ea2b2b] text-white",
            )}
            size="lg"
          >
            {isCorrect ? "CONTINUE" : "GOT IT"}
          </Button>
        </div>
      </div>
    </div>
  )
}
