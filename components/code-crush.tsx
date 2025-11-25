"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, Hammer, Bomb, Repeat, Type, Braces, Code2, Variable, GitBranch } from "lucide-react"
import { Button, ProgressBar } from "@/components/duolingo-ui"
import { Confetti } from "@/components/confetti"
import { cn } from "@/lib/utils"

// --- TYPES ---

type TileType = "loop" | "string" | "array" | "function" | "variable" | "condition" | "empty"

type Tile = {
  id: string
  type: TileType
  row: number
  col: number
  isMatched?: boolean
  isPowerUp?: boolean
  powerUpType?: "bomb" | "hammer"
}

type PowerUp = {
  type: "bomb" | "hammer"
  count: number
}

type GameState = "playing" | "completed"

// --- CONSTANTS ---

const GRID_SIZE = 6
const MATCH_COUNT = 3

const TILE_ICONS: Record<TileType, React.ComponentType<{ className?: string }>> = {
  loop: Repeat,
  string: Type,
  array: Braces,
  function: Code2,
  variable: Variable,
  condition: GitBranch,
  empty: () => null,
}

const TILE_COLORS: Record<TileType, string> = {
  loop: "from-purple-400 to-purple-600",
  string: "from-blue-400 to-blue-600",
  array: "from-green-400 to-green-600",
  function: "from-yellow-400 to-yellow-600",
  variable: "from-red-400 to-red-600",
  condition: "from-pink-400 to-pink-600",
  empty: "from-gray-200 to-gray-300",
}

// --- COMPONENT ---

export function CodeCrush({ onClose }: { onClose: () => void }) {
  const [grid, setGrid] = React.useState<Tile[][]>([])
  const [selectedTile, setSelectedTile] = React.useState<{ row: number; col: number } | null>(null)
  const [score, setScore] = React.useState(0)
  const [moves, setMoves] = React.useState(20)
  const [targetScore] = React.useState(500)
  const [gameState, setGameState] = React.useState<GameState>("playing")
  const [powerUps, setPowerUps] = React.useState<PowerUp[]>([
    { type: "bomb", count: 2 },
    { type: "hammer", count: 2 },
  ])
  const [activePowerUp, setActivePowerUp] = React.useState<"bomb" | "hammer" | null>(null)
  const [showConfetti, setShowConfetti] = React.useState(false)

  React.useEffect(() => {
    initializeGrid()
  }, [])

  React.useEffect(() => {
    if (score >= targetScore && gameState === "playing") {
      setGameState("completed")
      setShowConfetti(true)
    }
  }, [score, targetScore, gameState])

  const initializeGrid = () => {
    const types: TileType[] = ["loop", "string", "array", "function", "variable", "condition"]
    const newGrid: Tile[][] = []

    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row] = []
      for (let col = 0; col < GRID_SIZE; col++) {
        const type = types[Math.floor(Math.random() * types.length)]
        newGrid[row][col] = {
          id: `${row}-${col}-${Date.now()}`,
          type,
          row,
          col,
        }
      }
    }

    setGrid(newGrid)
  }

  const handleTileClick = (row: number, col: number) => {
    if (gameState !== "playing" || moves === 0) return

    // Handle power-up usage
    if (activePowerUp === "hammer") {
      // Remove single tile
      removeTile(row, col)
      setPowerUps((prev) => prev.map((p) => (p.type === "hammer" ? { ...p, count: p.count - 1 } : p)))
      setActivePowerUp(null)
      setMoves((m) => m - 1)
      return
    }

    if (activePowerUp === "bomb") {
      // Remove 3x3 area
      clearArea(row, col)
      setPowerUps((prev) => prev.map((p) => (p.type === "bomb" ? { ...p, count: p.count - 1 } : p)))
      setActivePowerUp(null)
      setMoves((m) => m - 1)
      return
    }

    // Normal tile selection and swapping
    if (!selectedTile) {
      setSelectedTile({ row, col })
    } else {
      const isAdjacent =
        (Math.abs(selectedTile.row - row) === 1 && selectedTile.col === col) ||
        (Math.abs(selectedTile.col - col) === 1 && selectedTile.row === row)

      if (isAdjacent) {
        swapTiles(selectedTile.row, selectedTile.col, row, col)
        setMoves((m) => m - 1)
      }
      setSelectedTile(null)
    }
  }

  const swapTiles = (row1: number, col1: number, row2: number, col2: number) => {
    const newGrid = [...grid]
    const temp = newGrid[row1][col1]
    newGrid[row1][col1] = newGrid[row2][col2]
    newGrid[row2][col2] = temp

    // Update positions
    newGrid[row1][col1].row = row1
    newGrid[row1][col1].col = col1
    newGrid[row2][col2].row = row2
    newGrid[row2][col2].col = col2

    setGrid(newGrid)

    // Check for matches after a short delay
    setTimeout(() => {
      checkMatches()
    }, 300)
  }

  const removeTile = (row: number, col: number) => {
    const newGrid = [...grid]
    newGrid[row][col].isMatched = true
    setGrid(newGrid)
    setScore((s) => s + 10)

    setTimeout(() => {
      fillEmptySpaces()
    }, 300)
  }

  const clearArea = (centerRow: number, centerCol: number) => {
    const newGrid = [...grid]
    let clearedCount = 0

    for (let row = Math.max(0, centerRow - 1); row <= Math.min(GRID_SIZE - 1, centerRow + 1); row++) {
      for (let col = Math.max(0, centerCol - 1); col <= Math.min(GRID_SIZE - 1, centerCol + 1); col++) {
        if (!newGrid[row][col].isMatched) {
          newGrid[row][col].isMatched = true
          clearedCount++
        }
      }
    }

    setGrid(newGrid)
    setScore((s) => s + clearedCount * 10)

    setTimeout(() => {
      fillEmptySpaces()
    }, 300)
  }

  const checkMatches = () => {
    const newGrid = [...grid]
    let hasMatches = false
    let matchCount = 0

    // Check horizontal matches
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        const type = newGrid[row][col].type
        if (
          type !== "empty" &&
          newGrid[row][col + 1].type === type &&
          newGrid[row][col + 2].type === type &&
          !newGrid[row][col].isMatched
        ) {
          newGrid[row][col].isMatched = true
          newGrid[row][col + 1].isMatched = true
          newGrid[row][col + 2].isMatched = true
          hasMatches = true
          matchCount += 3

          // Check for 4-match (super variable)
          if (col < GRID_SIZE - 3 && newGrid[row][col + 3].type === type) {
            newGrid[row][col + 3].isMatched = true
            matchCount++
            // Award power-up
            setPowerUps((prev) => prev.map((p) => (p.type === "bomb" ? { ...p, count: p.count + 1 } : p)))
          }
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row < GRID_SIZE - 2; row++) {
        const type = newGrid[row][col].type
        if (
          type !== "empty" &&
          newGrid[row + 1][col].type === type &&
          newGrid[row + 2][col].type === type &&
          !newGrid[row][col].isMatched
        ) {
          newGrid[row][col].isMatched = true
          newGrid[row + 1][col].isMatched = true
          newGrid[row + 2][col].isMatched = true
          hasMatches = true
          matchCount += 3

          // Check for 4-match
          if (row < GRID_SIZE - 3 && newGrid[row + 3][col].type === type) {
            newGrid[row + 3][col].isMatched = true
            matchCount++
            setPowerUps((prev) => prev.map((p) => (p.type === "bomb" ? { ...p, count: p.count + 1 } : p)))
          }
        }
      }
    }

    if (hasMatches) {
      setGrid(newGrid)
      setScore((s) => s + matchCount * 10)

      setTimeout(() => {
        fillEmptySpaces()
      }, 500)
    }
  }

  const fillEmptySpaces = () => {
    const newGrid = [...grid]
    const types: TileType[] = ["loop", "string", "array", "function", "variable", "condition"]

    // Remove matched tiles and drop tiles down
    for (let col = 0; col < GRID_SIZE; col++) {
      let emptyCount = 0
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (newGrid[row][col].isMatched) {
          emptyCount++
        } else if (emptyCount > 0) {
          newGrid[row + emptyCount][col] = { ...newGrid[row][col], row: row + emptyCount }
          newGrid[row][col] = {
            id: `${row}-${col}-${Date.now()}`,
            type: "empty",
            row,
            col,
            isMatched: true,
          }
        }
      }

      // Fill top with new tiles
      for (let row = 0; row < emptyCount; row++) {
        const type = types[Math.floor(Math.random() * types.length)]
        newGrid[row][col] = {
          id: `${row}-${col}-${Date.now()}-new`,
          type,
          row,
          col,
        }
      }
    }

    setGrid(newGrid)

    // Check for new matches
    setTimeout(() => {
      checkMatches()
    }, 300)
  }

  const handlePowerUpClick = (type: "bomb" | "hammer") => {
    const powerUp = powerUps.find((p) => p.type === type)
    if (powerUp && powerUp.count > 0) {
      setActivePowerUp(activePowerUp === type ? null : type)
    }
  }

  const handleRetry = () => {
    setScore(0)
    setMoves(20)
    setGameState("playing")
    setPowerUps([
      { type: "bomb", count: 2 },
      { type: "hammer", count: 2 },
    ])
    setActivePowerUp(null)
    setShowConfetti(false)
    initializeGrid()
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
            <h2 className="text-xl font-bold">Code Crush</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Score</div>
              <div className="text-2xl font-bold text-green-600">{score}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Moves</div>
              <div className="text-2xl font-bold">{moves}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {gameState === "playing" && (
          <div className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Target: {targetScore}</span>
                <span className="font-medium">{Math.round((score / targetScore) * 100)}%</span>
              </div>
              <ProgressBar progress={(score / targetScore) * 100} variant="success" />
            </div>

            {/* Power-ups */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePowerUpClick("bomb")}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-b-4 font-bold transition-all",
                  activePowerUp === "bomb"
                    ? "bg-yellow-400 border-yellow-600 text-yellow-900"
                    : "bg-card border-border hover:bg-muted",
                  powerUps.find((p) => p.type === "bomb")?.count === 0 && "opacity-50 cursor-not-allowed",
                )}
                disabled={powerUps.find((p) => p.type === "bomb")?.count === 0}
              >
                <Bomb className="w-5 h-5" />
                <span>Bomb</span>
                <span className="text-sm">({powerUps.find((p) => p.type === "bomb")?.count})</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePowerUpClick("hammer")}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-b-4 font-bold transition-all",
                  activePowerUp === "hammer"
                    ? "bg-red-400 border-red-600 text-red-900"
                    : "bg-card border-border hover:bg-muted",
                  powerUps.find((p) => p.type === "hammer")?.count === 0 && "opacity-50 cursor-not-allowed",
                )}
                disabled={powerUps.find((p) => p.type === "hammer")?.count === 0}
              >
                <Hammer className="w-5 h-5" />
                <span>Hammer</span>
                <span className="text-sm">({powerUps.find((p) => p.type === "hammer")?.count})</span>
              </motion.button>
            </div>

            {/* Grid */}
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
              <AnimatePresence mode="popLayout">
                {grid.map((row, rowIndex) =>
                  row.map((tile, colIndex) => {
                    const Icon = TILE_ICONS[tile.type]
                    const isSelected = selectedTile?.row === rowIndex && selectedTile?.col === colIndex

                    if (tile.isMatched) {
                      return (
                        <motion.div
                          key={tile.id}
                          initial={{ scale: 1, opacity: 1 }}
                          animate={{ scale: 0, opacity: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="aspect-square"
                        />
                      )
                    }

                    return (
                      <motion.div
                        key={tile.id}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleTileClick(rowIndex, colIndex)}
                        className={cn(
                          "aspect-square rounded-2xl bg-gradient-to-br flex items-center justify-center cursor-pointer shadow-lg border-4 transition-all",
                          TILE_COLORS[tile.type],
                          isSelected ? "border-white ring-4 ring-blue-500" : "border-white/50",
                          activePowerUp && "ring-2 ring-yellow-400",
                        )}
                      >
                        <Icon className="w-8 h-8 md:w-12 md:h-12 text-white" />
                      </motion.div>
                    )
                  }),
                )}
              </AnimatePresence>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-muted-foreground">
              {activePowerUp ? (
                <p className="font-bold text-yellow-600">
                  {activePowerUp === "bomb" ? "Click to clear 3x3 area" : "Click to remove a single tile"}
                </p>
              ) : (
                <p>Match 3 or more icons to score points!</p>
              )}
            </div>
          </div>
        )}

        {gameState === "completed" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 py-12"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl">
              <Zap className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-green-600">Level Complete!</h2>
            <p className="text-xl text-muted-foreground">Final Score: {score}</p>
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
      </div>
    </div>
  )
}
