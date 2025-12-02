"use client"

import * as React from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { X, Heart, Zap, RotateCcw, GripVertical, Terminal, Lock, Unlock, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProgressBar, FeedbackSheet } from "@/components/duolingo-ui"
import { Confetti } from "@/components/confetti"
import { cn } from "@/lib/utils"
import type {
  Question,
  CodeSegment,
  QuestionOption,
  ReorderItem,
  MatchPair,
} from "@/lib/generated/prisma/client"
import { useRouter } from "next/navigation"
import { useMissionProgress } from "@/lib/hooks/use-missions"
// Type for Question with all nested relations
type PrismaQuestion = Question & {
  codeSegments: CodeSegment[]
  options: QuestionOption[]
  items: ReorderItem[]
  pairs: MatchPair[]
}

type GameState = "playing" | "feedback" | "completed" | "failed" | "loading" | "error"

interface CompletionData {
  xpEarned: number
  streak: number
  streakMultiplier: number
}

// --- COMPONENT ---

export function CodeLessonGame({ lessonId }: { lessonId: string;}) {

  const router = useRouter()
  const { onQuestionAnswered, onMistakeFixed } = useMissionProgress()
  
  // State for loading questions from database
  const [questions, setQuestions] = React.useState<PrismaQuestion[]>([])
  const [sessionId, setSessionId] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [completionData, setCompletionData] = React.useState<CompletionData | null>(null)
  const [completionLoading, setCompletionLoading] = React.useState(false)

  // Game state
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [hearts, setHearts] = React.useState(5)
  const [gameState, setGameState] = React.useState<GameState>("loading")
  const [selectedSegmentId, setSelectedSegmentId] = React.useState<string | null>(null)
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null)
  const [reorderItems, setReorderItems] = React.useState<ReorderItem[]>([])
  const [feedbackStatus, setFeedbackStatus] = React.useState<"correct" | "incorrect">("correct")
  const [correctAnswerText, setCorrectAnswerText] = React.useState<string>("")
  const [selectedMatchIds, setSelectedMatchIds] = React.useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = React.useState<string[]>([])


  const onClose = () => {
    router.push(`/dashboard`)
  }
  // Fetch questions from database (dynamic selection)
  React.useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lessons/${lessonId}/questions`)
        if (!response.ok) throw new Error('Failed to load lesson')
        
        const data = await response.json()
        // New API returns questions array directly and sessionId
        setQuestions(data.questions || [])
        setSessionId(data.sessionId || null)
        
        if (data.questions?.length > 0) {
          setGameState("playing")
        } else {
          setError('No questions available for this lesson')
          setGameState("error")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setGameState("error")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [lessonId])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  // Shuffle pairs within each column for MATCH_MADNESS
  const shuffleArray = (arr: MatchPair[]) => {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const shuffleReorderItems = <T,>(arr: T[]) => {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const leftPairs = currentQuestion?.pairs?.filter((p) => p.index >= 1 && p.index <= 4) || []
  const rightPairs = currentQuestion?.pairs?.filter((p) => p.index >= 5 && p.index <= 8) || []

  const shuffledLeftPairs = React.useMemo(() => shuffleArray(leftPairs), [currentQuestion?.id])
  const shuffledRightPairs = React.useMemo(() => shuffleArray(rightPairs), [currentQuestion?.id])

  const shuffledReorderItems = React.useMemo(() => {
    if (currentQuestion?.type !== "REORDER" || !currentQuestion?.items) return []
    return shuffleReorderItems(currentQuestion.items)
  }, [currentQuestion?.id])

  React.useEffect(() => {
    if (!currentQuestion) return

    // Reset state for new question
    setSelectedSegmentId(null)
    setSelectedOptionId(null)
    setFeedbackStatus("correct")
    setCorrectAnswerText("")
    setSelectedMatchIds([])
    setMatchedPairs([])

    if (currentQuestion.type === "REORDER" && currentQuestion.items) {
      setReorderItems(shuffledReorderItems)
    }
  }, [currentQuestion, shuffledReorderItems])

  // Mark lesson as complete when game state is completed
  React.useEffect(() => {
    if (gameState !== "completed") return

    const completeLesson = async (): Promise<void> => {
      try {
        setCompletionLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lessons/${lessonId}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId, sessionId }),
        })

        if (!response.ok) {
          console.error('Failed to mark lesson complete')
          return
        }

        const data = (await response.json()) as CompletionData
        setCompletionData(data)
      } catch (err) {
        console.error('Failed to mark lesson complete:', err)
      } finally {
        setCompletionLoading(false)
      }
    }

    completeLesson()
  }, [gameState, lessonId, sessionId])

  // Match Madness Logic
  const handleMatchClick = (id: string) => {
    if (matchedPairs.includes(id)) return
    if (selectedMatchIds.includes(id)) {
      setSelectedMatchIds((prev) => prev.filter((item) => item !== id))
      return
    }

    const newSelection = [...selectedMatchIds, id]
    setSelectedMatchIds(newSelection)

    if (newSelection.length === 2) {
      const [firstId, secondId] = newSelection
      const firstPair = currentQuestion.pairs?.find((p) => p.id === firstId)
      const secondPair = currentQuestion.pairs?.find((p) => p.id === secondId)

      // Check if pairs match: firstPair.matchId === secondPair.text && secondPair.matchId === firstPair.text
      if (firstPair && secondPair && firstPair.matchId === secondPair.text && secondPair.matchId === firstPair.text) {
        // Match found
        setTimeout(() => {
          setMatchedPairs((prev) => [...prev, firstId, secondId])
          setSelectedMatchIds([])
        }, 300)
      } else {
        // No match
        setTimeout(() => {
          setSelectedMatchIds([])
        }, 800)
      }
    }
  }

  const handleCheck = async () => {
    if (gameState !== "playing" || !currentQuestion) return

    let isCorrect = false
    let correctText = ""
    let selectedAnswer = ""

    if (currentQuestion.type === "DEBUG_HUNT") {
      // Find the segment with the bug that was selected
      const selectedSegment = currentQuestion.codeSegments?.find((s) => s.id === selectedSegmentId)
      selectedAnswer = selectedSegmentId || ""
      if (selectedSegment?.isBug) {
        isCorrect = true
      } else {
        isCorrect = false
        const bugSegment = currentQuestion.codeSegments?.find((s) => s.isBug)
        correctText = bugSegment ? `The bug is: "${bugSegment.code}" should be "${bugSegment.correction}"` : "Find the segment with the bug."
      }
    } else if (
      currentQuestion.type === "MULTIPLE_CHOICE" ||
      currentQuestion.type === "FILL_BLANK" ||
      currentQuestion.type === "PREDICT_OUTPUT" ||
      currentQuestion.type === "LOGIC_PUZZLE" ||
      currentQuestion.type === "LINE_REPAIR"
    ) {
      const option = currentQuestion.options?.find((o) => o.id === selectedOptionId)
      selectedAnswer = selectedOptionId || ""
      isCorrect = !!option?.isCorrect
      correctText = currentQuestion.options?.find((o) => o.isCorrect)?.text || ""
    } else if (currentQuestion.type === "REORDER") {
      const currentOrder = reorderItems.map((item) => item.index)
      selectedAnswer = JSON.stringify(currentOrder)
      const correctOrder = currentQuestion.correctOrder || []
      isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder)

      if (!isCorrect) {
        const correctItems = correctOrder
          .map((index: number) => currentQuestion.items?.find((item) => item.index === index)?.index)
          .join("\n")
        correctText = correctItems || "Incorrect order"

      }
    } else if (currentQuestion.type === "MATCH_MADNESS") {
      // Check if all pairs are matched
      const totalPairs = currentQuestion.pairs?.length || 0
      selectedAnswer = JSON.stringify(matchedPairs)
      isCorrect = matchedPairs.length === totalPairs
      correctText = "Match all pairs to continue!"
    }

    // Submit answer to track user history (for adaptive learning)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selected: selectedAnswer,
          isCorrect,
          sessionId,
        }),
      })
      
      // Update mission progress for question answered
      if (currentQuestion.type) {
        onQuestionAnswered(currentQuestion.type, isCorrect)
      }
      
      // Track bug fixes for DEBUG_HUNT questions
      if (currentQuestion.type === "DEBUG_HUNT" && isCorrect) {
        onMistakeFixed()
      }
    } catch (err) {
      console.error('Failed to save answer:', err)
    }

    setFeedbackStatus(isCorrect ? "correct" : "incorrect")
    setCorrectAnswerText(correctText)
    setGameState("feedback")

    if (!isCorrect) {
      setHearts((h) => Math.max(0, h - 1))
    }
  }

  const handleNext = async () => {
    if (feedbackStatus === "incorrect") {
      if (hearts === 0) {
        setGameState("failed")
        return
      }
      
      // Move to next question after incorrect answer
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setGameState("playing")
        setSelectedSegmentId(null)
        setSelectedOptionId(null)
      } else {
        // If this was the last question, mark as completed
        setGameState("completed")
      }
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setGameState("playing")
      } else {
        setGameState("completed")
      }
    }
  }

  const handleRetry = () => {
    setCurrentQuestionIndex(0)
    setHearts(5)
    setGameState("playing")
    setSelectedSegmentId(null)
    setSelectedOptionId(null)
    if (questions[0]?.type === "REORDER" && questions[0]?.items) {
      setReorderItems(questions[0].items)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
        <p className="mt-4 text-muted-foreground font-medium">Loading lesson...</p>
      </div>
    )
  }

  // Error state
  if (error || gameState === "error") {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-red-500 mb-2">Error Loading Lesson</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={onClose}>Go Back</Button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return null
  }

  console.log("Segmenrs ",selectedSegmentId)
  const renderDebugHunt = () => (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 p-6 rounded-2xl font-mono text-lg text-white shadow-inner overflow-x-auto">
        <pre className="whitespace-pre-wrap">
          {currentQuestion.codeSegments?.map((segment) => {
            const isSelected = selectedSegmentId === segment.id
            const isBug = segment.isBug
            const showCorrect = gameState === "feedback" && isBug && feedbackStatus === "correct"
            const showWrongSelection = gameState === "feedback" && isSelected && !isBug && feedbackStatus === "incorrect"
            const showActualBug = gameState === "feedback" && isBug && feedbackStatus === "incorrect"

            return (
              <motion.span
                key={segment.id}
                onClick={() => gameState === "playing" && setSelectedSegmentId(segment.id)}
                className={cn(
                  "cursor-pointer px-1 rounded transition-colors border-2 border-transparent inline-block",
                  isSelected && gameState === "playing" && "bg-blue-500/30 border-blue-500",
                  showCorrect && "bg-green-500/30 border-green-500 text-green-400",
                  showWrongSelection && "bg-red-500/30 border-red-500 text-red-400",
                  showActualBug && "bg-green-500/30 border-green-500 text-green-400",
                  gameState === "playing" && !isSelected && "hover:bg-white/10",
                )}
                whileTap={{ scale: 0.95 }}
              >
                {segment.code}
              </motion.span>
            )
          })}
        </pre>
      </div>
      <p className="text-muted-foreground text-center font-medium">Tap the bug in the code above.</p>
    </div>
  )

  const renderMultipleChoice = () => (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 p-6 rounded-2xl font-mono text-lg text-white shadow-inner">
        <pre>{currentQuestion.codeBlock}</pre>
      </div>
      <div className="grid gap-3">
        {currentQuestion.options?.map((option) => {
          const isSelected = selectedOptionId === option.id
          const showCorrect = gameState === "feedback" && option.isCorrect
          const showIncorrect = gameState === "feedback" && isSelected && !option.isCorrect

          return (
            <div
              key={option.id}
              onClick={() => gameState === "playing" && setSelectedOptionId(option.id)}
              className={cn(
                "p-4 rounded-2xl border-2 border-b-4 cursor-pointer transition-all active:border-b-2 active:translate-y-[2px] font-mono text-sm md:text-base",
                gameState === "playing" && isSelected && "bg-card border-blue-500 cursor-default",
                gameState === "playing" && !isSelected && "bg-card border-border hover:bg-muted/50",
                showCorrect && "bg-green-100 border-green-500 text-green-700",
                showIncorrect && "bg-red-100 border-red-500 text-red-700",
                gameState === "feedback" && !showCorrect && !showIncorrect && "bg-card border-border opacity-50",
              )}
            >
              {option.text}
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderReorder = () => {
    const correctOrder = currentQuestion.correctOrder || []
    const currentOrder = reorderItems.map((item) => item.index)
    const isOrderCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder)

    return (
      <div className="flex flex-col gap-6">
        <Reorder.Group axis="y" values={reorderItems} onReorder={setReorderItems} className="flex flex-col gap-3">
          {reorderItems.map((item, idx) => {
            const isInCorrectPosition = gameState === "feedback" && item.index === correctOrder[idx]
            const isInWrongPosition = gameState === "feedback" && item.index !== correctOrder[idx]

            return (
              <Reorder.Item key={item.id} value={item}>
                <div
                  className={cn(
                    "p-4 rounded-2xl border-2 border-b-4 cursor-grab active:cursor-grabbing flex items-center gap-4 font-mono text-sm md:text-base select-none",
                    gameState === "playing" && "bg-card border-border hover:bg-muted/50",
                    gameState === "feedback" && "pointer-events-none",
                    gameState === "feedback" && isOrderCorrect && "bg-green-100 border-green-500 text-green-700",
                    isInCorrectPosition && !isOrderCorrect && "bg-green-100 border-green-500 text-green-700",
                    isInWrongPosition && "bg-red-100 border-red-500 text-red-700",
                  )}
                >
                  <GripVertical className={cn(
                    "w-5 h-5 shrink-0",
                    gameState === "playing" && "text-muted-foreground",
                    isInCorrectPosition && "text-green-600",
                    isInWrongPosition && "text-red-600",
                  )} />
                  <span>{item.text}</span>
                </div>
              </Reorder.Item>
            )
          })}
        </Reorder.Group>
      </div>
    )
  }

  const renderFillBlank = () => {
    const selectedOption = currentQuestion.options?.find((o) => o.id === selectedOptionId)
    const correctOption = currentQuestion.options?.find((o) => o.isCorrect)
    const showCorrect = gameState === "feedback" && feedbackStatus === "correct"
    const showIncorrect = gameState === "feedback" && feedbackStatus === "incorrect"

    return (
      <div className="flex flex-col gap-8">
        <div className={cn(
          "bg-code-editor-bg p-6 rounded-2xl font-mono text-lg md:text-xl text-white shadow-inner leading-relaxed",
          showCorrect && "ring-2 ring-green-500",
          showIncorrect && "ring-2 ring-red-500",
        )}>
          <span>{currentQuestion.codeBefore}</span>
          <span className={cn(
            "inline-flex items-center justify-center min-w-[80px] h-[1.5em] mx-1 align-middle border-b-2 rounded px-2 relative top-[1px]",
            gameState === "playing" && "border-white/30 bg-white/5",
            showCorrect && "border-green-500 bg-green-500/20",
            showIncorrect && "border-red-500 bg-red-500/20",
          )}>
            {selectedOption ? (
              <motion.span
                layoutId={`option-${selectedOption.id}`}
                className={cn(
                  "font-bold",
                  gameState === "playing" && "text-blue-400",
                  showCorrect && "text-green-400",
                  showIncorrect && "text-red-400",
                )}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              >
                {selectedOption.text}
              </motion.span>
            ) : (
              <span className="opacity-0 select-none">_____</span>
            )}
          </span>
          <span>{currentQuestion.codeAfter}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentQuestion.options?.map((option) => {
            const isSelected = selectedOptionId === option.id
            const isCorrectOption = option.isCorrect
            const showOptionCorrect = gameState === "feedback" && isCorrectOption
            const showOptionIncorrect = gameState === "feedback" && isSelected && !isCorrectOption

            return (
              <button
                key={option.id}
                onClick={() => gameState === "playing" && setSelectedOptionId(option.id)}
                className={cn(
                  "h-14 rounded-xl border-2 border-b-4 font-mono text-lg font-medium transition-all relative",
                  gameState === "playing" && isSelected && "bg-muted border-transparent text-transparent cursor-default",
                  gameState === "playing" && !isSelected && "bg-card border-border hover:bg-muted/50 active:border-b-2 active:translate-y-[2px]",
                  showOptionCorrect && "bg-green-100 border-green-500",
                  showOptionIncorrect && "bg-red-100 border-red-500",
                  gameState === "feedback" && !showOptionCorrect && !showOptionIncorrect && "bg-card border-border opacity-50",
                )}
                disabled={gameState !== "playing"}
              >
                <span className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  gameState === "playing" && isSelected && "opacity-0",
                  showOptionCorrect && "text-green-700",
                  showOptionIncorrect && "text-red-700",
                )}>
                  {gameState === "playing" && isSelected ? (
                    option.text
                  ) : gameState === "feedback" ? (
                    option.text
                  ) : (
                    <motion.span layoutId={`option-${option.id}`} className="text-foreground">
                      {option.text}
                    </motion.span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderPredictOutput = () => {
    const selectedOption = currentQuestion.options?.find((o) => o.id === selectedOptionId)
    const showCorrect = gameState === "feedback" && feedbackStatus === "correct"
    const showIncorrect = gameState === "feedback" && feedbackStatus === "incorrect"

    return (
      <div className="flex flex-col gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl font-mono text-lg text-white shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <Terminal className="w-12 h-12" />
          </div>
          <pre>{currentQuestion.codeBlock}</pre>
          <div className={cn(
            "mt-4 pt-4 border-t border-white/10 flex items-center gap-2",
            gameState === "playing" && "text-muted-foreground",
            showCorrect && "text-green-400",
            showIncorrect && "text-red-400",
          )}>
            <span className="text-green-400">➜</span>
            {gameState === "feedback" && selectedOption ? (
              <span className={cn(
                "font-bold",
                showCorrect && "text-green-400",
                showIncorrect && "text-red-400",
              )}>{selectedOption.text}</span>
            ) : (
              <span className="animate-pulse">_</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentQuestion.options?.map((option) => {
            const isSelected = selectedOptionId === option.id
            const isCorrectOption = option.isCorrect
            const showOptionCorrect = gameState === "feedback" && isCorrectOption
            const showOptionIncorrect = gameState === "feedback" && isSelected && !isCorrectOption

            return (
              <div
                key={option.id}
                onClick={() => gameState === "playing" && setSelectedOptionId(option.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 border-b-4 cursor-pointer transition-all active:border-b-2 active:translate-y-[2px] font-mono text-center font-bold text-lg",
                  gameState === "playing" && isSelected && "bg-blue-100 border-blue-500 text-blue-600",
                  gameState === "playing" && !isSelected && "bg-card border-border hover:bg-muted/50",
                  showOptionCorrect && "bg-green-100 border-green-500 text-green-700",
                  showOptionIncorrect && "bg-red-100 border-red-500 text-red-700",
                  gameState === "feedback" && !showOptionCorrect && !showOptionIncorrect && "bg-card border-border opacity-50",
                )}
              >
                {option.text}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderLogicPuzzle = () => {
    const isUnlocked = gameState === "feedback" && feedbackStatus === "correct"
    const isLocked = gameState === "feedback" && feedbackStatus === "incorrect"

    return (
      <div className="flex flex-col gap-8 items-center">
        <motion.div
          className="relative w-40 h-40 flex items-center justify-center"
          animate={isUnlocked ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : isLocked ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={isLocked ? { duration: 0.4 } : undefined}
        >
          <div
            className={cn(
              "w-32 h-32 rounded-3xl flex items-center justify-center shadow-xl transition-colors duration-500",
              isUnlocked && "bg-yellow-400",
              isLocked && "bg-red-500",
              gameState === "playing" && "bg-slate-700",
            )}
          >
            {isUnlocked ? (
              <Unlock className="w-16 h-16 text-yellow-900" />
            ) : (
              <Lock className={cn(
                "w-16 h-16",
                isLocked ? "text-red-200" : "text-slate-400",
              )} />
            )}
          </div>
          {isUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -50 }}
              className="absolute top-0 text-yellow-500 font-bold text-2xl"
            >
              OPEN!
            </motion.div>
          )}
          {isLocked && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -50 }}
              className="absolute top-0 text-red-500 font-bold text-2xl"
            >
              WRONG!
            </motion.div>
          )}
        </motion.div>

        <div className={cn(
          "p-4 rounded-xl border-2 font-mono font-bold",
          gameState === "playing" && "bg-slate-100 border-slate-200 text-slate-600",
          isUnlocked && "bg-green-100 border-green-300 text-green-700",
          isLocked && "bg-red-100 border-red-300 text-red-700",
        )}>
          {currentQuestion.logicCondition}
        </div>

        <div className="grid grid-cols-1 gap-3 w-full">
          {currentQuestion.options?.map((option) => {
            const isSelected = selectedOptionId === option.id
            const isCorrectOption = option.isCorrect
            const showOptionCorrect = gameState === "feedback" && isCorrectOption
            const showOptionIncorrect = gameState === "feedback" && isSelected && !isCorrectOption

            return (
              <div
                key={option.id}
                onClick={() => gameState === "playing" && setSelectedOptionId(option.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 border-b-4 cursor-pointer transition-all active:border-b-2 active:translate-y-[2px] font-mono text-center font-bold",
                  gameState === "playing" && isSelected && "bg-blue-100 border-blue-500 text-blue-600",
                  gameState === "playing" && !isSelected && "bg-card border-border hover:bg-muted/50",
                  showOptionCorrect && "bg-green-100 border-green-500 text-green-700",
                  showOptionIncorrect && "bg-red-100 border-red-500 text-red-700",
                  gameState === "feedback" && !showOptionCorrect && !showOptionIncorrect && "bg-card border-border opacity-50",
                )}
              >
                {option.text}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderMatchMadness = () => {
    const renderPairButton = (pair: MatchPair) => {
      const isMatched = matchedPairs.includes(pair.id)
      const isSelected = selectedMatchIds.includes(pair.id)
      const isNotMatched =
        selectedMatchIds.length === 2 &&
        isSelected &&
        !matchedPairs.includes(pair.id)

      console.log("Matched Pairs: ", isNotMatched)
      if (isMatched) {
        return (
          <motion.div
            key={pair.id}
            className="h-16 animate-shake rounded-xl bg-green-100 border-2 border-green-500 flex items-center justify-center px-2 text-center font-mono text-sm md:text-base font-medium text-green-600"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            {pair.text}
          </motion.div>
        )
      }
    
      // if (isNotMatched) {
      //   return (
      //     <motion.div
      //       key={pair.id}
      //       className="h-16 rounded-xl bg-red-100 border-2 border-red-500 flex items-center justify-center px-2 text-center font-mono text-sm md:text-base font-medium text-red-600"
      //         initial={{ opacity: 1, scale: 1 }}
      // animate={{ opacity: 1, scale: [1, 1.15, 1] }}   // bounce then return
      // transition={{
      //   duration: 0.45,
      //   type: "spring",
      //   stiffness: 260,
      //   damping: 14
      // }}
      //     >
      //       {pair.text}
      //     </motion.div>
      //   )
      // }
      return (
        <motion.button
          key={pair.id}
          layoutId={`match-${pair.id}`}
          onClick={() => handleMatchClick(pair.id)}
          animate={isNotMatched ? { x: [0, -10, 10, -10, 10, 0] } : isSelected ? { scale: 0.95 } : { scale: 1 }}
          transition={isNotMatched ? { duration: 0.3, ease: "easeInOut" } : { duration: 0.1 }}
          className={cn(
            "h-16 rounded-xl border-2 border-b-4 font-mono text-sm md:text-base font-medium transition-all flex items-center justify-center px-2 text-center",
            isSelected ? "bg-blue-100 border-blue-500 text-blue-600" : "bg-card border-border hover:bg-muted/50",
            isNotMatched && "bg-red-100 border-red-500 text-red-600",
            isMatched && "bg-green-500/20 border-green-500 text-green-600 cursor-default",
          )}
          whileTap={{ scale: 0.95 }}
        >
          {pair.text}
        </motion.button>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2 text-orange-500 font-bold">
            <Timer className="w-5 h-5" />
            <span>FAST MODE</span>
          </div>
          <div className="text-muted-foreground font-bold text-sm">
            {matchedPairs.length / 2} / {(currentQuestion.pairs?.length || 0) / 2} PAIRS
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-3">
            {shuffledLeftPairs.map((pair) => renderPairButton(pair))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-3">
            {shuffledRightPairs.map((pair) => renderPairButton(pair))}
          </div>
        </div>
      </div>
    )
  }

  if (gameState === "completed") {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 animate-in fade-in">
        <Confetti />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Zap className="w-16 h-16 text-yellow-800 fill-current" />
          </div>
          <h1 className="text-4xl font-extrabold text-yellow-500 mb-4">Lesson Complete!</h1>
          <p className="text-xl text-muted-foreground font-bold mb-8">You fixed all the bugs and earned XP!</p>
          
          {completionData && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-orange-100 p-4 rounded-2xl border-2 border-orange-200">
                <div className="text-orange-600 font-bold uppercase text-xs mb-1">Total XP</div>
                <div className="text-2xl font-extrabold text-orange-700">+{completionData.xpEarned}</div>
                {completionData.streakMultiplier > 1 && (
                  <div className="text-xs text-orange-600 mt-1">×{completionData.streakMultiplier} streak</div>
                )}
              </div>
              <div className="bg-blue-100 p-4 rounded-2xl border-2 border-blue-200">
                <div className="text-blue-600 font-bold uppercase text-xs mb-1">Streak</div>
                <div className="text-2xl font-extrabold text-blue-700">🔥 {completionData.streak}</div>
              </div>
            </div>
          )}
          
          <Button size="lg" className="w-full" onClick={onClose}>
            CONTINUE
          </Button>
        </motion.div>
      </div>
    )
  }

  if (gameState === "failed") {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 animate-in fade-in">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart className="w-16 h-16 text-red-500 fill-current" />
          </div>
          <h1 className="text-3xl font-extrabold text-red-500 mb-4">Out of hearts!</h1>
          <p className="text-lg text-muted-foreground font-medium mb-8">
            Don't worry, mistakes help you learn. Try again to restore your hearts.
          </p>
          <Button size="lg" variant="secondary" className="w-full mb-4" onClick={handleRetry}>
            <RotateCcw className="mr-2 w-5 h-5" /> TRY AGAIN
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            QUIT
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background flex flex-col">
      <div className="flex items-center gap-4 p-4 md:px-8 md:py-6 max-w-4xl mx-auto w-full">
        <button onClick={onClose} className="text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
        <ProgressBar value={progress} className="flex-1" color="bg-primary" />
        <div className="flex items-center gap-1.5 text-red-500 font-bold">
          <Heart className="w-6 h-6 fill-current animate-pulse" />
          <span className="text-lg">{hearts}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">{currentQuestion.instruction}</h2>
                {currentQuestion.description && (
                  <p className="text-muted-foreground font-medium text-lg">{currentQuestion.description}</p>
                )}
              </div>

              {currentQuestion.type === "DEBUG_HUNT" && renderDebugHunt()}
              {currentQuestion.type === "MULTIPLE_CHOICE" && renderMultipleChoice()}
              {currentQuestion.type === "REORDER" && renderReorder()}
              {currentQuestion.type === "FILL_BLANK" && renderFillBlank()}
              {currentQuestion.type === "PREDICT_OUTPUT" && renderPredictOutput()}
              {currentQuestion.type === "LOGIC_PUZZLE" && renderLogicPuzzle()}
              {currentQuestion.type === "MATCH_MADNESS" && renderMatchMadness()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 border-t-2 border-border bg-background z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="hidden md:block text-muted-foreground font-bold uppercase tracking-widest text-sm">
            {gameState === "playing" ? "Tap to select" : "Review your answer"}
          </div>
          <Button
            size="lg"
            className={cn(
              "w-full md:w-auto md:min-w-[150px]",
              gameState === "playing" &&
                currentQuestion.type !== "REORDER" &&
                currentQuestion.type !== "MATCH_MADNESS" &&
                !selectedSegmentId &&
                !selectedOptionId &&
                "opacity-50",
              gameState === "playing" &&
                currentQuestion.type === "MATCH_MADNESS" &&
                matchedPairs.length !== (currentQuestion.pairs?.length || 0) &&
                "opacity-50",
            )}
            onClick={handleCheck}
            disabled={
              gameState === "playing" &&
              ((currentQuestion.type !== "REORDER" &&
                currentQuestion.type !== "MATCH_MADNESS" &&
                !selectedSegmentId &&
                !selectedOptionId) ||
                (currentQuestion.type === "MATCH_MADNESS" && matchedPairs.length !== (currentQuestion.pairs?.length || 0)))
            }
          >
            {currentQuestion.type === "MATCH_MADNESS" && gameState === "playing" ? "CONTINUE" : "CHECK"}
          </Button>
        </div>
      </div>

      <FeedbackSheet
        isOpen={gameState === "feedback"}
        status={feedbackStatus || "correct"}
        onNext={handleNext}
        correctAnswer={correctAnswerText}
      />
    </div>
  )
}
