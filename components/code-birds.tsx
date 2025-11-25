"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, Play, RotateCcw } from "lucide-react"
import { Button, Input } from "@/components/duolingo-ui"
import confetti from "canvas-confetti"

interface Projectile {
  x: number
  y: number
  vx: number
  vy: number
  active: boolean
}

interface GameTarget {
  x: number
  y: number
  hit: boolean
}

export function CodeBirds({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [velocity, setVelocity] = useState("60")
  const [angle, setAngle] = useState("45")
  const [gravity, setGravity] = useState("9.8")
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)

  // Game state
  const [projectile, setProjectile] = useState<Projectile>({ x: 50, y: 350, vx: 0, vy: 0, active: false })
  const [target, setTarget] = useState<GameTarget>({
    x: 400 + Math.random() * 300,
    y: 200 + Math.random() * 150,
    hit: false,
  })

  const resetGame = () => {
    setProjectile({ x: 50, y: 350, vx: 0, vy: 0, active: false })
    setTarget({ x: 400 + Math.random() * 300, y: 200 + Math.random() * 150, hit: false })
    setIsPlaying(false)
  }

  const launch = () => {
    if (isPlaying) return

    const v = Number.parseFloat(velocity)
    const a = Number.parseFloat(angle) * (Math.PI / 180) // Convert to radians

    setProjectile({
      x: 50,
      y: 350,
      vx: v * Math.cos(a),
      vy: -v * Math.sin(a), // Negative because canvas Y is down
      active: true,
    })
    setIsPlaying(true)
  }

  useEffect(() => {
    if (!isPlaying || !projectile.active) return

    let animationId: number
    const g = Number.parseFloat(gravity) * 0.1 // Scale gravity for canvas

    const update = () => {
      setProjectile((prev) => {
        // Check bounds
        if (prev.y > 400 || prev.x > 800) {
          setIsPlaying(false)
          return { ...prev, active: false }
        }

        // Check collision
        const dx = prev.x - target.x
        const dy = prev.y - target.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 30 && !target.hit) {
          setTarget((t) => ({ ...t, hit: true }))
          setScore((s) => s + 100)
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { x: prev.x / 800, y: prev.y / 400 },
          })
          setIsPlaying(false)
          return { ...prev, active: false }
        }

        return {
          ...prev,
          x: prev.x + prev.vx * 0.1,
          y: prev.y + prev.vy * 0.1,
          vy: prev.vy + g * 0.1,
        }
      })

      animationId = requestAnimationFrame(update)
    }

    animationId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animationId)
  }, [isPlaying, gravity, target])

  // Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw Ground
    ctx.fillStyle = "#58CC02"
    ctx.fillRect(0, 380, canvas.width, 20)
    ctx.fillStyle = "#4BAF00"
    ctx.fillRect(0, 390, canvas.width, 10)

    // Draw Launcher
    ctx.fillStyle = "#8B4513"
    ctx.fillRect(40, 350, 20, 30)

    // Draw Target (Bug)
    if (!target.hit) {
      ctx.fillStyle = "#FF4B4B"
      ctx.beginPath()
      ctx.arc(target.x, target.y, 15, 0, Math.PI * 2)
      ctx.fill()
      // Eyes
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(target.x - 5, target.y - 2, 4, 0, Math.PI * 2)
      ctx.arc(target.x + 5, target.y - 2, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "black"
      ctx.beginPath()
      ctx.arc(target.x - 5, target.y - 2, 1.5, 0, Math.PI * 2)
      ctx.arc(target.x + 5, target.y - 2, 1.5, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Explosion effect
      ctx.fillStyle = "#FFC800"
      ctx.beginPath()
      ctx.arc(target.x, target.y, 25, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw Projectile (Code Block)
    if (projectile.active || (!isPlaying && !target.hit)) {
      ctx.save()
      ctx.translate(projectile.x, projectile.y)
      // Rotate based on velocity
      if (projectile.active) {
        ctx.rotate(Math.atan2(projectile.vy, projectile.vx))
      }

      ctx.fillStyle = "#1CB0F6"
      ctx.beginPath()
      ctx.roundRect(-10, -10, 20, 20, 4)
      ctx.fill()
      ctx.strokeStyle = "#1480B3"
      ctx.lineWidth = 2
      ctx.stroke()

      // Code symbol
      ctx.fillStyle = "white"
      ctx.font = "bold 12px monospace"
      ctx.fillText("{}", -6, 4)

      ctx.restore()
    }

    // Trajectory Preview (if not playing)
    if (!isPlaying && !target.hit) {
      ctx.beginPath()
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.setLineDash([5, 5])
      let px = 50
      let py = 350
      const v = Number.parseFloat(velocity)
      const a = Number.parseFloat(angle) * (Math.PI / 180)
      const pvx = v * Math.cos(a)
      let pvy = -v * Math.sin(a)
      const g = Number.parseFloat(gravity) * 0.1

      ctx.moveTo(px, py)
      for (let i = 0; i < 50; i++) {
        px += pvx * 0.1
        py += pvy * 0.1
        pvy += g * 0.1
        ctx.lineTo(px, py)
      }
      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [projectile, target, velocity, angle, gravity, isPlaying])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl bg-sky-300 rounded-3xl overflow-hidden shadow-2xl border-4 border-sky-500 flex flex-col"
      >
        {/* Header */}
        <div className="bg-sky-400 p-4 flex items-center justify-between border-b-4 border-sky-600">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl border-b-4 border-gray-200">{/* Target icon */}</div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide drop-shadow-md">Code Birds</h2>
              <p className="text-sky-100 text-xs font-bold uppercase">Physics & Variables</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-black/20 px-4 py-2 rounded-xl text-white font-bold">Score: {score}</div>
            <button onClick={onClose} className="text-white hover:text-sky-100 transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[600px]">
          {/* Game Area */}
          <div className="flex-1 relative bg-sky-200 overflow-hidden">
            {/* Clouds */}
            <div className="absolute top-10 left-20 text-white/60 text-6xl">☁️</div>
            <div className="absolute top-20 right-40 text-white/40 text-4xl">☁️</div>

            <canvas ref={canvasRef} width={800} height={400} className="w-full h-full object-contain" />
          </div>

          {/* Controls */}
          <div className="w-full lg:w-80 bg-white p-6 border-l-4 border-sky-100 flex flex-col gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 uppercase text-sm">Launch Parameters</h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Velocity (v)</label>
                <div className="flex gap-2">
                  <Input value={velocity} onChange={(e) => setVelocity(e.target.value)} className="font-mono" />
                  <span className="flex items-center text-gray-400 font-bold">m/s</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Angle (θ)</label>
                <div className="flex gap-2">
                  <Input value={angle} onChange={(e) => setAngle(e.target.value)} className="font-mono" />
                  <span className="flex items-center text-gray-400 font-bold">deg</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Gravity (g)</label>
                <div className="flex gap-2">
                  <Input value={gravity} onChange={(e) => setGravity(e.target.value)} className="font-mono" />
                  <span className="flex items-center text-gray-400 font-bold">m/s²</span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <Button size="lg" className="w-full" onClick={launch} disabled={isPlaying || target.hit}>
                <Play className="w-5 h-5 mr-2" />
                LAUNCH CODE
              </Button>

              <Button variant="secondary" className="w-full" onClick={resetGame}>
                <RotateCcw className="w-5 h-5 mr-2" />
                RESET LEVEL
              </Button>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl text-xs text-gray-500">
              <strong>Tip:</strong> Increase velocity to reach further targets. Adjust angle for height.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
