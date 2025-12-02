"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, Zap, Swords, Shield, Bug, Code2, Braces, Repeat, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/duolingo-ui"
import { Confetti } from "@/components/confetti"
import { cn } from "@/lib/utils"

// --- TYPES ---

type CardType = "loop" | "string" | "array" | "function" | "variable"

type Card = {
  id: string
  type: CardType
  name: string
  power: number
  description: string
  icon: React.ComponentType<{ className?: string }>
}

type Enemy = {
  id: string
  name: string
  health: number
  maxHealth: number
  bugType: string
  icon: React.ComponentType<{ className?: string }>
}

type GameState = "playing" | "victory" | "defeat"

// --- MOCK DATA ---

const CARDS: Card[] = [
  {
    id: "card-1",
    type: "loop",
    name: "For Loop",
    power: 3,
    description: "Iterate and attack 3 times",
    icon: Repeat,
  },
  {
    id: "card-2",
    type: "string",
    name: "String Method",
    power: 2,
    description: "Parse and damage",
    icon: Type,
  },
  {
    id: "card-3",
    type: "array",
    name: "Array Push",
    power: 4,
    description: "Add power to attack",
    icon: Braces,
  },
  {
    id: "card-4",
    type: "function",
    name: "Function Call",
    power: 5,
    description: "Execute powerful attack",
    icon: Code2,
  },
  {
    id: "card-5",
    type: "variable",
    name: "Variable Assign",
    power: 2,
    description: "Store damage value",
    icon: Zap,
  },
]

const ENEMIES: Enemy[] = [
  {
    id: "enemy-1",
    name: "Syntax Error",
    health: 10,
    maxHealth: 10,
    bugType: "Missing semicolon",
    icon: Bug,
  },
  {
    id: "enemy-2",
    name: "Logic Bug",
    health: 15,
    maxHealth: 15,
    bugType: "Wrong operator",
    icon: Bug,
  },
  {
    id: "enemy-3",
    name: "Runtime Error",
    health: 20,
    maxHealth: 20,
    bugType: "Undefined variable",
    icon: Bug,
  },
]

// --- COMPONENT ---

export function CodeCardBattle({ onClose }: { onClose: () => void }) {
  const [gameState, setGameState] = React.useState<GameState>("playing")
  const [currentEnemyIndex, setCurrentEnemyIndex] = React.useState(0)
  const [enemyHealth, setEnemyHealth] = React.useState(ENEMIES[0].maxHealth)
  const [playerHealth, setPlayerHealth] = React.useState(20)
  const [hand, setHand] = React.useState<Card[]>([])
  const [selectedCard, setSelectedCard] = React.useState<Card | null>(null)
  const [showConfetti, setShowConfetti] = React.useState(false)
  const [battleLog, setBattleLog] = React.useState<string[]>([])

  const currentEnemy = ENEMIES[currentEnemyIndex]

  React.useEffect(() => {
    // Draw initial hand
    drawCards(3)
  }, [])

  const drawCards = (count: number) => {
    const newCards: Array<Card & { id: string }> = []
    for (let i = 0; i < count; i++) {
      const randomCard = CARDS[Math.floor(Math.random() * CARDS.length)]
      newCards.push({ ...randomCard, id: `${randomCard.id}-${Date.now()}-${i}` })
    }
    setHand((prev) => [...prev, ...newCards])
  }

  const handleCardPlay = (card: Card) => {
    if (gameState !== "playing") return

    setSelectedCard(card)

    // Player attacks
    const damage = card.power
    const newEnemyHealth = Math.max(0, enemyHealth - damage)
    setEnemyHealth(newEnemyHealth)
    setBattleLog((prev) => [...prev, `You used ${card.name} for ${damage} damage!`])

    // Remove card from hand
    setHand((prev) => prev.filter((c) => c.id !== card.id))

    setTimeout(() => {
      if (newEnemyHealth === 0) {
        // Enemy defeated
        if (currentEnemyIndex < ENEMIES.length - 1) {
          // Next enemy
          setBattleLog((prev) => [...prev, `${currentEnemy.name} defeated!`])
          setTimeout(() => {
            setCurrentEnemyIndex((prev) => prev + 1)
            setEnemyHealth(ENEMIES[currentEnemyIndex + 1].maxHealth)
            drawCards(2)
            setBattleLog([])
          }, 1500)
        } else {
          // Victory
          setGameState("victory")
          setShowConfetti(true)
        }
      } else {
        // Enemy attacks back
        const enemyDamage = Math.floor(Math.random() * 3) + 1
        const newPlayerHealth = Math.max(0, playerHealth - enemyDamage)
        setPlayerHealth(newPlayerHealth)
        setBattleLog((prev) => [...prev, `${currentEnemy.name} attacks for ${enemyDamage} damage!`])

        if (newPlayerHealth === 0) {
          setGameState("defeat")
        } else {
          // Draw a new card
          drawCards(1)
        }
      }

      setSelectedCard(null)
    }, 1000)
  }

  const handleRetry = () => {
    setGameState("playing")
    setCurrentEnemyIndex(0)
    setEnemyHealth(ENEMIES[0].maxHealth)
    setPlayerHealth(20)
    setHand([])
    setBattleLog([])
    drawCards(3)
  }

  const cardColors: Record<CardType, string> = {
    loop: "from-purple-400 to-purple-600",
    string: "from-blue-400 to-blue-600",
    array: "from-green-400 to-green-600",
    function: "from-yellow-400 to-yellow-600",
    variable: "from-red-400 to-red-600",
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b-2 border-border p-4 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Swords className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold">Code Card Battle</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            <span className="text-xl font-bold">{playerHealth}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 pb-32">
        {gameState === "playing" && (
          <div className="space-y-8">
            {/* Enemy */}
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="relative"
                animate={selectedCard ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl">
                  <currentEnemy.icon className="w-16 h-16 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-red-600 border-4 border-white flex items-center justify-center text-white font-bold shadow-lg"
                  key={enemyHealth}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                >
                  {enemyHealth}
                </motion.div>
              </motion.div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-red-600">{currentEnemy.name}</h3>
                <p className="text-sm text-muted-foreground">{currentEnemy.bugType}</p>
              </div>

              {/* Health Bar */}
              <div className="w-full max-w-md">
                <ProgressBar value={(enemyHealth / currentEnemy.maxHealth) * 100} color="bg-red-500" />
              </div>
            </div>

            {/* Battle Log */}
            <div className="bg-slate-100 rounded-2xl p-4 min-h-[100px] max-h-[150px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {battleLog.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium text-slate-700 py-1"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Player Hand */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-center">Your Cards</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {hand.map((card) => (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -50 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCardPlay(card)}
                      className={cn(
                        "relative cursor-pointer rounded-2xl p-4 shadow-xl border-4 border-white bg-gradient-to-br",
                        cardColors[card.type],
                      )}
                    >
                      <div className="flex flex-col items-center gap-2 text-white">
                        <card.icon className="w-12 h-12" />
                        <h5 className="font-bold text-center text-sm">{card.name}</h5>
                        <p className="text-xs text-center opacity-90">{card.description}</p>
                        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center shadow-lg">
                          {card.power}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {gameState === "victory" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 py-12"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl">
              <Shield className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-green-600">Victory!</h2>
            <p className="text-xl text-muted-foreground">You defeated all the bugs!</p>
            <div className="flex gap-4">
              <Button variant="primary" size="lg" onClick={handleRetry}>
                Play Again
              </Button>
              <Button variant="outline" size="lg" onClick={onClose}>
                Exit
              </Button>
            </div>
          </motion.div>
        )}

        {gameState === "defeat" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 py-12"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-2xl">
              <Bug className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-red-600">Defeated!</h2>
            <p className="text-xl text-muted-foreground">The bugs won this time...</p>
            <div className="flex gap-4">
              <Button variant="destructive" size="lg" onClick={handleRetry}>
                Try Again
              </Button>
              <Button variant="outline" size="lg" onClick={onClose}>
                Exit
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
