"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Shield } from "lucide-react"
import { Button, Badge } from "@/components/duolingo-ui"
import { cn } from "@/lib/utils"

// Game Constants
const LANES = 3
const LANE_WIDTH = 100 // Percentage width / 3 roughly
const GAME_SPEED_START = 5
const SPAWN_RATE = 1500 // ms

type ObstacleType = "correct" | "wrong" | "missing" | "powerup"

interface Obstacle {
  id: string
  lane: number
  type: ObstacleType
  content: string
  y: number
  speed: number
  powerupType?: "shield" | "magnet" | "multiplier"
}

interface Question {
  text: string
  correct: string
  wrong: string[]
}

const QUESTIONS: Question[] = [
  {
    text: "Select the valid variable name",
    correct: "myVar",
    wrong: ["2var", "my-var", "var"],
  },
  {
    text: "Which is a loop?",
    correct: "for",
    wrong: ["if", "const", "function"],
  },
  {
    text: "Array method to add element",
    correct: "push",
    wrong: ["pop", "shift", "slice"],
  },
  {
    text: "Boolean value",
    correct: "true",
    wrong: ["'true'", "1", "yes"],
  },
]

export function CodeRunner({ onClose }: { onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [lane, setLane] = useState(1) // 0, 1, 2
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question>(QUESTIONS[0])
  const [shieldActive, setShieldActive] = useState(false)
  const [multiplier, setMultiplier] = useState(1)

  const requestRef = useRef<number | undefined>(undefined)
  const lastSpawnTime = useRef<number>(0)
  const scoreRef = useRef(0)

  // Game Loop
  const updateGame = useCallback((time: number) => {
    if (!lastSpawnTime.current) lastSpawnTime.current = time

    // Spawn obstacles
    if (time - lastSpawnTime.current > SPAWN_RATE) {
      spawnObstacles()
      lastSpawnTime.current = time
    }

    setObstacles((prev) => {
      const newObstacles = prev.map((obs) => ({ ...obs, y: obs.y + obs.speed })).filter((obs) => obs.y < 120) // Remove if off screen

      // Collision Detection
      // Player is roughly at y=80 to y=90
      const playerY = 85
      const hitBox = 5

      // Check collisions
      // We need to find obstacles that are colliding with the player
      // Since we are inside the state update, we can't easily trigger side effects
      // So we'll handle collision logic in a separate effect or check here and return filtered

      return newObstacles
    })

    requestRef.current = requestAnimationFrame(updateGame)
  }, [])

  // Separate effect for collision detection to handle state updates safely
  useEffect(() => {
    if (!isPlaying || gameOver) return

    const playerY = 85
    const hitBox = 10 // increased hitbox for better feel

    obstacles.forEach((obs) => {
      if (obs.lane === lane && obs.y > playerY - hitBox && obs.y < playerY + hitBox) {
        handleCollision(obs)
      }
    })
  }, [obstacles, lane, isPlaying, gameOver])

  const handleCollision = (obs: Obstacle) => {
    // Remove the obstacle immediately to prevent double collision
    setObstacles((prev) => prev.filter((o) => o.id !== obs.id))

    if (obs.type === "correct") {
      setScore((s) => s + 10 * multiplier)
      // Pick new question
      setCurrentQuestion(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)])
    } else if (obs.type === "powerup") {
      activatePowerup(obs.powerupType!)
    } else {
      // Wrong or Missing
      if (shieldActive) {
        setShieldActive(false)
      } else {
        endGame()
      }
    }
  }

  const activatePowerup = (type: "shield" | "magnet" | "multiplier") => {
    if (type === "shield") setShieldActive(true)
    if (type === "multiplier") {
      setMultiplier(2)
      setTimeout(() => setMultiplier(1), 5000)
    }
    // Magnet logic would go here (auto-move to correct lane)
  }

  const spawnObstacles = () => {
    const id = Math.random().toString(36).substr(2, 9)
    const isPowerup = Math.random() > 0.8

    if (isPowerup) {
      const type = Math.random() > 0.5 ? "shield" : "multiplier"
      const randomLane = Math.floor(Math.random() * 3)
      setObstacles((prev) => [
        ...prev,
        {
          id,
          lane: randomLane,
          type: "powerup",
          content: type === "shield" ? "🛡️" : "2️⃣❌",
          y: -10,
          speed: 0.5,
          powerupType: type,
        },
      ])
    } else {
      // Spawn a row of answers for the current question
      // One correct, two wrong
      const lanes = [0, 1, 2]
      const correctLane = lanes[Math.floor(Math.random() * lanes.length)]

      const newObstacles: Obstacle[] = []

      // Correct Answer
      newObstacles.push({
        id: id + "-correct",
        lane: correctLane,
        type: "correct",
        content: currentQuestion.correct,
        y: -10,
        speed: 0.5,
      })

      // Wrong Answers
      lanes
        .filter((l) => l !== correctLane)
        .forEach((l, i) => {
          newObstacles.push({
            id: id + "-wrong-" + i,
            lane: l,
            type: "wrong",
            content: currentQuestion.wrong[i % currentQuestion.wrong.length] || "Error",
            y: -10,
            speed: 0.5,
          })
        })

      setObstacles((prev) => [...prev, ...newObstacles])
    }
  }

  const startGame = () => {
    setIsPlaying(true)
    setGameOver(false)
    setScore(0)
    setObstacles([])
    setLane(1)
    lastSpawnTime.current = 0
    requestRef.current = requestAnimationFrame(updateGame)
  }

  const endGame = () => {
    setIsPlaying(false)
    setGameOver(true)
    if (requestRef.current) cancelAnimationFrame(requestRef.current)
  }

  useEffect(() => {
    if (isPlaying && !gameOver) {
      requestRef.current = requestAnimationFrame(updateGame)
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [isPlaying, gameOver, updateGame])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return
      if (e.key === "ArrowLeft") setLane((l) => Math.max(0, l - 1))
      if (e.key === "ArrowRight") setLane((l) => Math.min(2, l + 1))
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPlaying])

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
            <Badge variant="accent" className="text-lg px-3">
              {score} XP
            </Badge>
            {multiplier > 1 && <Badge variant="secondary">2x XP</Badge>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative bg-slate-900 overflow-hidden perspective-1000">
          {/* Grid Background Effect */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(#1CB0F6 1px, transparent 1px), linear-gradient(90deg, #1CB0F6 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              transform: "perspective(500px) rotateX(60deg) translateY(-100px) scale(2)",
            }}
          />

          {/* Question Overlay */}
          <div className="absolute top-4 left-0 right-0 z-20 flex justify-center">
            <div className="bg-background/90 backdrop-blur border-2 border-border px-6 py-2 rounded-2xl shadow-lg text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase">Mission</p>
              <p className="font-extrabold text-lg">{currentQuestion.text}</p>
            </div>
          </div>

          {/* Lanes */}
          <div className="absolute inset-0 flex">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex-1 border-r border-white/10 last:border-0 relative">
                {/* Lane Marker */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              </div>
            ))}
          </div>

          {/* Obstacles */}
          <AnimatePresence>
            {obstacles.map((obs) => (
              <motion.div
                key={obs.id}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: `${obs.y}%`, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0 }} // Controlled by state
                className="absolute w-1/3 px-2 flex justify-center"
                style={{
                  left: `${obs.lane * 33.33}%`,
                  top: 0, // Position controlled by animate y
                }}
              >
                <div
                  className={cn(
                    "w-full aspect-square rounded-2xl flex items-center justify-center text-center p-2 shadow-lg border-b-4 font-bold text-sm break-words",
                    obs.type === "correct" && "bg-green-500 border-green-700 text-white",
                    obs.type === "wrong" && "bg-red-500 border-red-700 text-white",
                    obs.type === "powerup" && "bg-yellow-400 border-yellow-600 text-yellow-900",
                  )}
                >
                  {obs.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Player */}
          <motion.div
            animate={{ left: `${lane * 33.33}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-8 w-1/3 px-4 z-30"
          >
            <div
              className={cn(
                "w-full aspect-square bg-blue-500 rounded-full border-b-4 border-blue-700 flex items-center justify-center shadow-xl relative",
                shieldActive && "ring-4 ring-yellow-400 ring-offset-2 ring-offset-slate-900",
              )}
            >
              <img src="/majestic-owl.png" className="w-3/4 h-3/4 object-contain" alt="Player" />
              {shieldActive && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                  <Shield className="w-3 h-3 text-yellow-900" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Controls Overlay (Mobile) */}
          <div className="absolute inset-0 z-40 flex">
            <div
              className="flex-1 active:bg-white/5 transition-colors"
              onClick={() => setLane((l) => Math.max(0, l - 1))}
            />
            <div
              className="flex-1 active:bg-white/5 transition-colors"
              onClick={() => setLane((l) => Math.min(2, l + 1))}
            />
          </div>

          {/* Start / Game Over Screen */}
          {(!isPlaying || gameOver) && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-background p-6 rounded-3xl border-b-4 border-border w-full max-w-sm space-y-6">
                {gameOver ? (
                  <>
                    <div className="text-5xl mb-2">💀</div>
                    <h2 className="text-2xl font-extrabold text-red-500">Game Over!</h2>
                    <p className="text-muted-foreground font-bold">Score: {score}</p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-2">🏃‍♂️</div>
                    <h2 className="text-2xl font-extrabold text-primary">Code Runner</h2>
                    <p className="text-muted-foreground">
                      Swipe or use arrow keys to dodge bugs and collect correct code!
                    </p>
                  </>
                )}

                <Button size="lg" className="w-full" onClick={startGame}>
                  {gameOver ? "TRY AGAIN" : "START RUNNING"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
