"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, Zap, Shield, Sword } from "lucide-react"
import { Button, ProgressBar, Badge } from "@/components/duolingo-ui"
import { cn } from "@/lib/utils"

type Phase = "intro" | "player-turn" | "enemy-turn" | "attack" | "win" | "lose"

interface Move {
  name: string
  damage: number
  type: "attack" | "heal" | "special"
  color: string
  icon: any
  question?: {
    text: string
    options: string[]
    correct: number
  }
}

const MOVES: Move[] = [
  {
    name: "console.log()",
    damage: 20,
    type: "attack",
    color: "bg-blue-500",
    icon: Sword,
    question: {
      text: "What does console.log() do?",
      options: ["Prints to debug console", "Deletes a file", "Creates a loop"],
      correct: 0,
    },
  },
  {
    name: "for-loop strike",
    damage: 35,
    type: "special",
    color: "bg-orange-500",
    icon: Zap,
    question: {
      text: "Which loop runs 5 times?",
      options: ["for(i=0;i<5;i++)", "while(true)", "if(i==5)"],
      correct: 0,
    },
  },
  {
    name: "Bug Fix Heal",
    damage: -30, // Negative damage = heal
    type: "heal",
    color: "bg-green-500",
    icon: Heart,
    question: {
      text: "Fix: let x = 5;",
      options: ["Correct as is", "let x == 5", "int x = 5"],
      correct: 0,
    },
  },
  {
    name: "const Shield",
    damage: 0, // Defensive
    type: "special",
    color: "bg-purple-500",
    icon: Shield,
    question: {
      text: "Can you reassign a const?",
      options: ["No", "Yes", "Sometimes"],
      correct: 0,
    },
  },
]

export function CodeMon({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("intro")
  const [playerHealth, setPlayerHealth] = useState(100)
  const [enemyHealth, setEnemyHealth] = useState(100)
  const [dialog, setDialog] = useState("A wild Bugzor appeared!")
  const [selectedMove, setSelectedMove] = useState<Move | null>(null)
  const [showQuestion, setShowQuestion] = useState(false)

  useEffect(() => {
    if (phase === "intro") {
      setTimeout(() => {
        setPhase("player-turn")
        setDialog("What will you do?")
      }, 2000)
    }
  }, [phase])

  const handleMoveSelect = (move: Move) => {
    setSelectedMove(move)
    setShowQuestion(true)
  }

  const handleAnswer = (index: number) => {
    if (!selectedMove) return

    setShowQuestion(false)

    if (index === selectedMove.question?.correct) {
      // Correct
      executeMove(selectedMove)
    } else {
      // Incorrect
      setDialog("Missed! Syntax Error!")
      setTimeout(() => {
        setPhase("enemy-turn")
        enemyTurn()
      }, 1500)
    }
  }

  const executeMove = (move: Move) => {
    setPhase("attack")
    setDialog(`Used ${move.name}!`)

    setTimeout(() => {
      if (move.type === "heal") {
        setPlayerHealth((h) => Math.min(100, h - move.damage))
      } else {
        setEnemyHealth((h) => Math.max(0, h - move.damage))
      }

      setTimeout(() => {
        if (enemyHealth - move.damage <= 0 && move.type !== "heal") {
          setPhase("win")
        } else {
          setPhase("enemy-turn")
          enemyTurn()
        }
      }, 1000)
    }, 500)
  }

  const enemyTurn = () => {
    setDialog("Bugzor is attacking!")
    setTimeout(() => {
      const damage = Math.floor(Math.random() * 20) + 10
      setPlayerHealth((h) => Math.max(0, h - damage))
      setDialog(`Bugzor dealt ${damage} damage!`)

      setTimeout(() => {
        if (playerHealth - damage <= 0) {
          setPhase("lose")
        } else {
          setPhase("player-turn")
          setDialog("Your turn!")
        }
      }, 1500)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-background w-full max-w-md h-[80vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border-4 border-border relative"
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-border flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-lg px-3">
              BATTLE
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Battle Area */}
        <div className="flex-1 relative bg-sky-100 p-4 flex flex-col justify-between overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl" />
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-200 rounded-full blur-xl" />
          </div>

          {/* Enemy HUD */}
          <div className="flex justify-end mb-4 relative z-10">
            <div className="bg-white/80 backdrop-blur p-3 rounded-2xl border-2 border-border shadow-sm w-48">
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-slate-700">Bugzor</span>
                <span className="text-xs font-bold text-muted-foreground">Lvl 5</span>
              </div>
              <ProgressBar value={enemyHealth} color="bg-red-500" className="h-3" />
            </div>
          </div>

          {/* Enemy Sprite */}
          <motion.div
            animate={phase === "enemy-turn" ? { x: [0, -20, 0], rotate: [0, -5, 0] } : { y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute top-24 right-12 w-32 h-32"
          >
            <div className="w-full h-full relative">
              {/* Simple CSS Monster */}
              <div className="absolute inset-0 bg-red-500 rounded-full shadow-lg border-b-4 border-red-700" />
              <div className="absolute top-8 left-6 w-8 h-8 bg-white rounded-full border-2 border-black flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <div className="absolute top-8 right-6 w-8 h-8 bg-white rounded-full border-2 border-black flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <div className="absolute bottom-8 left-8 right-8 h-2 bg-black rounded-full" />
              {/* Antennae */}
              <div className="absolute -top-4 left-8 w-2 h-8 bg-red-700 -rotate-12" />
              <div className="absolute -top-4 right-8 w-2 h-8 bg-red-700 rotate-12" />
            </div>
          </motion.div>

          {/* Player Sprite */}
          <motion.div
            animate={phase === "attack" ? { x: [0, 50, 0], rotate: [0, 10, 0] } : { y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute bottom-32 left-12 w-32 h-32"
          >
            <img src="/majestic-owl.png" className="w-full h-full object-contain drop-shadow-xl" alt="Player" />
          </motion.div>

          {/* Player HUD */}
          <div className="flex justify-start mt-auto relative z-10">
            <div className="bg-white/80 backdrop-blur p-3 rounded-2xl border-2 border-border shadow-sm w-48">
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-slate-700">You</span>
                <span className="text-xs font-bold text-muted-foreground">{playerHealth}/100</span>
              </div>
              <ProgressBar value={playerHealth} color="bg-green-500" className="h-3" />
            </div>
          </div>
        </div>

        {/* Dialog / Controls */}
        <div className="h-1/3 bg-background border-t-2 border-border p-4 flex flex-col">
          <div className="flex-1 bg-muted/30 rounded-xl p-4 mb-4 border-2 border-border/50 flex items-center">
            <p className="font-bold text-lg text-slate-700">{dialog}</p>
          </div>

          {phase === "player-turn" && (
            <div className="grid grid-cols-2 gap-2">
              {MOVES.map((move) => (
                <button
                  key={move.name}
                  onClick={() => handleMoveSelect(move)}
                  className={cn(
                    "p-3 rounded-xl border-b-4 font-bold text-white text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 active:border-b-0 active:translate-y-1",
                    move.color,
                    move.color.replace("bg-", "border-").replace("500", "700"),
                  )}
                >
                  <move.icon className="w-4 h-4" />
                  {move.name}
                </button>
              ))}
            </div>
          )}

          {(phase === "win" || phase === "lose") && (
            <Button size="lg" className="w-full" onClick={onClose}>
              {phase === "win" ? "VICTORY! CONTINUE" : "DEFEATED... TRY AGAIN"}
            </Button>
          )}
        </div>

        {/* Question Modal Overlay */}
        <AnimatePresence>
          {showQuestion && selectedMove && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end"
            >
              <div className="bg-background w-full rounded-t-3xl p-6 border-t-4 border-border space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-extrabold">Quick Quiz!</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowQuestion(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-lg font-medium">{selectedMove.question?.text}</p>
                <div className="space-y-2">
                  {selectedMove.question?.options.map((opt, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 bg-transparent"
                      onClick={() => handleAnswer(i)}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
