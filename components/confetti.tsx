"use client"

import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react"

export interface ConfettiRef {
  fire: () => void
}

const COLORS = ['#58CC02', '#FFC800', '#1CB0F6', '#FF4B4B']
const SHAPES = ['circle', 'square', 'triangle', 'star'] as const

interface Particle {
  x: number
  y: number
  w: number
  h: number
  vx: number
  vy: number
  color: string
  shape: typeof SHAPES[number]
  angle: number
  spin: number
  drag: number
  gravity: number
  opacity: number
  decay: number
  scale: number
  wobble: number
  wobbleSpeed: number
}

export const Confetti = forwardRef<ConfettiRef, {}>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isActive, setIsActive] = useState(false)
  const particles = useRef<Particle[]>([])
  const animationId = useRef<number | null>(null)

  const createParticle = (x: number, y: number): Particle => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    const size = Math.random() * 12 + 10
    
    return {
      x,
      y,
      w: size,
      h: size,
      vx: (Math.random() - 0.5) * 25,
      vy: -Math.random() * 25 - 12,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 8,
      drag: 0.95,
      gravity: 0.7,
      opacity: 1,
      decay: Math.random() * 0.01 + 0.005,
      scale: 1,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.random() * 0.1 + 0.05
    }
  }

  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
    ctx.fill()
  }

  const drawSoftTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const h = size * (Math.sqrt(3) / 2)
    const r = size * 0.2
    
    ctx.beginPath()
    ctx.moveTo(x, y - h / 2 + r)
    ctx.quadraticCurveTo(x, y - h / 2, x + r * 0.866, y - h / 2 + r * 0.5)
    ctx.lineTo(x + size / 2 - r * 0.866, y + h / 2 - r * 0.5)
    ctx.quadraticCurveTo(x + size / 2, y + h / 2, x + size / 2 - r, y + h / 2)
    ctx.lineTo(x - size / 2 + r, y + h / 2)
    ctx.quadraticCurveTo(x - size / 2, y + h / 2, x - size / 2 + r * 0.866, y + h / 2 - r * 0.5)
    ctx.closePath()
    ctx.fill()
  }

  const drawSoftStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
    ctx.lineJoin = 'round'
    ctx.lineWidth = 6
    ctx.strokeStyle = ctx.fillStyle as string
    ctx.stroke()
    ctx.fill()
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.current.forEach((p, index) => {
      p.x += p.vx
      p.y += p.vy
      p.vx *= p.drag
      p.vy += p.gravity
      p.angle += p.spin
      p.opacity -= p.decay
      p.wobble += p.wobbleSpeed

      if (p.opacity <= 0 || p.y > canvas.height) {
        particles.current.splice(index, 1)
        return
      }

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.angle * Math.PI) / 180)
      ctx.scale(Math.abs(Math.cos(p.wobble)), 1)
      
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color

      if (p.shape === 'circle') {
        ctx.beginPath()
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
        ctx.fill()
      } else if (p.shape === 'square') {
        drawRoundedRect(ctx, -p.w / 2, -p.h / 2, p.w, p.h, p.w * 0.3)
      } else if (p.shape === 'triangle') {
        drawSoftTriangle(ctx, 0, 0, p.w)
      } else if (p.shape === 'star') {
        drawSoftStar(ctx, 0, 0, 5, p.w / 1.5, p.w / 3)
      }

      ctx.restore()
    })

    if (particles.current.length > 0) {
      animationId.current = requestAnimationFrame(animate)
    } else {
      setIsActive(false)
    }
  }

  const fire = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    setIsActive(true)

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    for (let i = 0; i < 100; i++) {
      particles.current.push(createParticle(centerX, centerY))
    }

    if (!animationId.current || particles.current.length <= 100) {
      cancelAnimationFrame(animationId.current!)
      animate()
    }
  }

  useImperativeHandle(ref, () => ({
    fire
  }))

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationId.current) cancelAnimationFrame(animationId.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[100] ${isActive ? 'block' : 'hidden'}`}
    />
  )
})

Confetti.displayName = "Confetti"
