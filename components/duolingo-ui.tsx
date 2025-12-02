"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Check, X, Heart, Flag, Zap, Target, Gift, Trophy, Star, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// --- BUTTONS ---

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold uppercase tracking-widest ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-[4px] active:border-b-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground border-b-4 border-primary-depth hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground border-b-4 border-secondary-depth hover:bg-secondary/90",
        destructive:
          "bg-destructive text-destructive-foreground border-b-4 border-destructive-depth hover:bg-destructive/90",
        accent: "bg-accent text-accent-foreground border-b-4 border-accent-depth hover:bg-accent/90",
        outline: "bg-transparent border-2 border-b-4 border-border text-muted-foreground hover:bg-muted",
        ghost: "bg-transparent text-primary hover:bg-primary/10 border-0 active:translate-y-0",
        super: "bg-indigo-500 text-white border-b-4 border-indigo-700 hover:bg-indigo-600",
        sidebar:
          "justify-start gap-4 px-4 py-3 text-muted-foreground hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200 border-2 border-transparent uppercase tracking-widest font-bold rounded-xl active:translate-y-0",
        sidebarActive:
          "justify-start gap-4 px-4 py-3 bg-blue-50 text-blue-500 border-2 border-blue-200 uppercase tracking-widest font-bold rounded-xl active:translate-y-0",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-xl px-3 text-xs border-b-[3px] active:translate-y-[3px]",
        lg: "h-14 rounded-2xl px-8 text-base border-b-[5px] active:translate-y-[5px]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

// --- CARDS ---

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-3xl border-2 border-border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  ),
)
Card.displayName = "Card"

export const LessonCard = ({
  title,
  description,
  icon: Icon,
  color = "bg-primary",
  active,
}: { title: string; description: string; icon: any; color?: string; active?: boolean }) => (
  <div
    className={cn(
      "relative flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-b-4 transition-all cursor-pointer active:border-b-2 active:translate-y-[2px]",
      active ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/50",
    )}
  >
    <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white shadow-sm", color)}>
      <Icon className="w-8 h-8" strokeWidth={2.5} />
    </div>
    <h3 className="font-bold text-lg text-foreground mb-1">{title}</h3>
    <p className="text-muted-foreground text-sm font-medium">{description}</p>
  </div>
)

// --- INPUTS ---

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border-2 border-border bg-input px-4 py-2 text-sm font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-secondary focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

// --- PROGRESS BAR ---

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

// --- BADGES ---

export const Badge = ({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode
  variant?: "default" | "outline" | "secondary" | "accent" | "destructive"
  className?: string
}) => {
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border-2 border-border text-muted-foreground bg-transparent",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className,
      )}
    >
      {children}
    </div>
  )
}

// --- ALERTS ---

export const Alert = ({
  variant = "info",
  title,
  children,
}: { variant?: "success" | "error" | "warning" | "info"; title?: string; children: React.ReactNode }) => {
  const styles = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  }

  return (
    <div className={cn("p-4 rounded-2xl border-2 flex gap-3", styles[variant])}>
      <div className="flex-1">
        {title && <h5 className="font-bold mb-1">{title}</h5>}
        <div className="text-sm font-medium opacity-90">{children}</div>
      </div>
    </div>
  )
}

// --- TOGGLE / SWITCH ---

export const Switch = ({
  checked,
  onCheckedChange,
}: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "peer inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      checked ? "bg-primary" : "bg-border",
    )}
  >
    <span
      className={cn(
        "pointer-events-none block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition-transform",
        checked ? "translate-x-6" : "translate-x-0",
      )}
    />
  </button>
)

// --- CHECKBOX ---

export const Checkbox = ({
  checked,
  onCheckedChange,
  label,
}: { checked: boolean; onCheckedChange: (checked: boolean) => void; label?: string }) => (
  <div className="flex items-center space-x-3">
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "peer h-6 w-6 shrink-0 rounded-lg border-2 border-border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center transition-all",
        checked ? "bg-secondary border-secondary text-white" : "bg-white",
      )}
    >
      {checked && <Check className="h-4 w-4 stroke-[4]" />}
    </button>
    {label && (
      <label
        className="text-sm font-bold text-muted-foreground cursor-pointer select-none"
        onClick={() => onCheckedChange(!checked)}
      >
        {label}
      </label>
    )}
  </div>
)

// --- RADIO ---

export const RadioGroup = ({
  options,
  value,
  onChange,
}: { options: { label: string; value: string }[]; value: string; onChange: (value: string) => void }) => (
  <div className="flex flex-col gap-2">
    {options.map((option) => (
      <div
        key={option.value}
        onClick={() => onChange(option.value)}
        className={cn(
          "flex items-center justify-between p-4 rounded-2xl border-2 border-b-4 cursor-pointer transition-all active:border-b-2 active:translate-y-[2px]",
          value === option.value
            ? "bg-blue-50 border-secondary text-secondary"
            : "bg-card border-border hover:bg-muted/50",
        )}
      >
        <span className="font-bold">{option.label}</span>
        <div
          className={cn(
            "h-6 w-6 rounded-full border-2 flex items-center justify-center",
            value === option.value ? "border-secondary" : "border-border",
          )}
        >
          {value === option.value && <div className="h-3 w-3 rounded-full bg-secondary" />}
        </div>
      </div>
    ))}
  </div>
)

// --- AVATAR ---

export const Avatar = ({
  src,
  fallback,
  size = "md",
  className,
}: { src?: string; fallback: string; size?: "sm" | "md" | "lg" | "xl"; className?: string }) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base",
    xl: "h-24 w-24 text-xl",
  }

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full border-2 border-border",
        sizes[size],
        className,
      )}
    >
      {src ? (
        <img className="aspect-square h-full w-full object-cover" src={src || "/placeholder.svg"} alt="Avatar" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-bold uppercase tracking-widest">
          {fallback}
        </div>
      )}
    </div>
  )
}

// --- TOOLTIP ---

export const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => (
  <div className="group relative flex items-center justify-center">
    {children}
    <div className="absolute bottom-full mb-2 hidden group-hover:block z-50">
      <div className="bg-foreground text-background text-xs font-bold py-2 px-3 rounded-xl uppercase tracking-wide whitespace-nowrap shadow-xl">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-foreground" />
      </div>
    </div>
  </div>
)

// --- MODAL ---

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl border-2 border-border animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b-2 border-border bg-muted/30">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="p-4 border-t-2 border-border bg-muted/30 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

// --- TABS ---

export const Tabs = ({
  tabs,
  activeTab,
  onChange,
}: { tabs: string[]; activeTab: string; onChange: (tab: string) => void }) => (
  <div className="flex p-1 bg-muted rounded-2xl border-2 border-border">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={cn(
          "flex-1 py-2 px-4 rounded-xl text-sm font-bold uppercase tracking-wide transition-all",
          activeTab === tab
            ? "bg-background text-primary shadow-sm border-2 border-border"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {tab}
      </button>
    ))}
  </div>
)

// --- STEPPER ---

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

// --- FEEDBACK SHEET ---

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
  const isCorrect = status === "correct"

  // Auto-continue on incorrect answer after 2 seconds
  React.useEffect(() => {
    if (!isOpen || isCorrect) return

    const timer = setTimeout(() => {
      onNext()
    }, 2000)

    return () => clearTimeout(timer)
  }, [isOpen, isCorrect, onNext])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 p-6 border-t-2 animate-in slide-in-from-bottom-full duration-300 z-50",
        isCorrect ? "bg-green-100 border-transparent" : "bg-red-100 border-transparent",
      )}
    >
      <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div
            className={cn(
              "w-16 h-16 rounded-full flex shrink-0 items-center justify-center shadow-sm",
              isCorrect ? "bg-white text-primary" : "bg-white text-destructive",
            )}
          >
            {isCorrect ? <Check className="w-10 h-10 stroke-[4]" /> : <X className="w-10 h-10 stroke-[4]" />}
          </div>
          <div className="flex-1">
            <h3 className={cn("text-2xl font-extrabold mb-1", isCorrect ? "text-primary" : "text-destructive")}>
              {isCorrect ? "Excellent!" : "Incorrect"}
            </h3>
            {!isCorrect && correctAnswer && (
              <div className="text-destructive font-medium">
                Correct solution: <span className="font-bold">{correctAnswer}</span>
              </div>
            )}
            {isCorrect && <div className="text-primary font-bold">You earned 10 XP!</div>}
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {!isCorrect && (
            <button className="p-3 rounded-2xl hover:bg-black/5 text-destructive transition-colors">
              <Flag className="w-6 h-6" />
            </button>
          )}
          {isCorrect ? (
            <Button
              onClick={onNext}
              className={cn(
                "w-full md:w-auto min-w-[150px]",
                "bg-primary border-primary-depth hover:bg-primary-depth text-primary-foreground",
              )}
              size="lg"
            >
              CONTINUE
            </Button>
          ) : (
            <Button
              className={cn(
                "w-full md:w-auto min-w-[150px]",
                "bg-destructive border-destructive-depth hover:bg-destructive-depth text-destructive-foreground",
              )}
              size="lg"
              disabled
            >
              Continuing...
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// --- MISSION SYSTEM COMPONENTS ---

// Mission types
interface MissionReward {
  id: string
  xp: number
  gems: number
  hearts: number
  streakFreeze: number
  xpBooster: number
  items: string[]
}

interface Mission {
  id: string
  type: 'DAILY' | 'WEEKLY' | 'EVENT'
  category: string
  goal: string
  targetCount: number
  currentCount: number
  status: 'PENDING' | 'COMPLETED' | 'CLAIMED'
  reward: MissionReward | null
  expiresAt: string
}

// Category icon mapping
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  XP: Zap,
  LESSON: Target,
  BUG_FIX: Target,
  PREDICT: Star,
  TIMED: Zap,
  STORY: Target,
  ROLEPLAY: Target,
  VIDEO: Target,
  LOGIC: Star,
}

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  XP: 'bg-yellow-400',
  LESSON: 'bg-green-500',
  BUG_FIX: 'bg-red-500',
  PREDICT: 'bg-purple-500',
  TIMED: 'bg-orange-500',
  STORY: 'bg-blue-500',
  ROLEPLAY: 'bg-pink-500',
  VIDEO: 'bg-indigo-500',
  LOGIC: 'bg-teal-500',
}

// --- MISSION PROGRESS BAR ---

export const MissionProgressBar = ({
  current,
  target,
  className,
  showLabel = true,
}: {
  current: number
  target: number
  className?: string
  showLabel?: boolean
}) => {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100))
  const isComplete = current >= target

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-5 bg-gray-200 rounded-full overflow-hidden">
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-600 z-10">
            {current} / {target}
          </div>
        )}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "h-full transition-all rounded-full",
            isComplete ? "bg-green-500" : "bg-yellow-400"
          )}
        />
      </div>
    </div>
  )
}

// --- MISSION CARD ---

export const MissionCard = ({
  mission,
  onClaim,
  isLoading = false,
}: {
  mission: Mission
  onClaim?: (missionId: string) => void
  isLoading?: boolean
}) => {
  const Icon = CATEGORY_ICONS[mission.category] || Target
  const iconColor = CATEGORY_COLORS[mission.category] || 'bg-gray-500'
  const isComplete = mission.status === 'COMPLETED'
  const isClaimed = mission.status === 'CLAIMED'
  const progress = Math.min(mission.currentCount, mission.targetCount)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-2xl border-2 transition-all",
        isComplete && !isClaimed
          ? "bg-green-50 border-green-200"
          : isClaimed
          ? "bg-gray-50 border-gray-200 opacity-60"
          : "bg-white border-gray-200"
      )}
    >
      {/* Icon */}
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0", iconColor)}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-sm font-bold text-gray-700 truncate">{mission.goal}</p>
        <MissionProgressBar current={progress} target={mission.targetCount} />
      </div>

      {/* Reward / Claim button */}
      <div className="shrink-0">
        {isComplete && !isClaimed && onClaim ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onClaim(mission.id)}
            disabled={isLoading}
            className="bg-green-500 border-green-600 hover:bg-green-400"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Gift className="w-4 h-4" />
            )}
          </Button>
        ) : isClaimed ? (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        ) : mission.reward ? (
          <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
            {mission.reward.xp > 0 && (
              <span className="flex items-center gap-0.5">
                <Zap className="w-3 h-3 text-yellow-500" />
                {mission.reward.xp}
              </span>
            )}
            {mission.reward.gems > 0 && (
              <span className="flex items-center gap-0.5">
                💎 {mission.reward.gems}
              </span>
            )}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}

// --- MISSION LIST ---

export const MissionList = ({
  missions,
  title,
  onClaim,
  isLoading = false,
  emptyMessage = "No missions available",
}: {
  missions: Mission[]
  title: string
  onClaim?: (missionId: string) => void
  isLoading?: boolean
  emptyMessage?: string
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-gray-700">{title}</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg text-gray-700">{title}</h3>
      {missions.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">{emptyMessage}</p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onClaim={onClaim}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// --- REWARD POPUP ---

export const RewardPopup = ({
  isOpen,
  onClose,
  reward,
}: {
  isOpen: boolean
  onClose: () => void
  reward: MissionReward | null
}) => {
  if (!isOpen || !reward) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center">
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Trophy className="w-16 h-16 text-white mx-auto mb-2" />
            </motion.div>
            <h2 className="text-2xl font-extrabold text-white">Reward Claimed!</h2>
          </div>

          {/* Rewards */}
          <div className="p-6 space-y-4">
            <div className="flex justify-center gap-6">
              {reward.xp > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                    <Zap className="w-7 h-7 text-yellow-500" />
                  </div>
                  <p className="font-bold text-lg text-gray-700">+{reward.xp}</p>
                  <p className="text-xs text-gray-500">XP</p>
                </motion.div>
              )}

              {reward.gems > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">💎</span>
                  </div>
                  <p className="font-bold text-lg text-gray-700">+{reward.gems}</p>
                  <p className="text-xs text-gray-500">Gems</p>
                </motion.div>
              )}

              {reward.hearts > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <Heart className="w-7 h-7 text-red-500 fill-current" />
                  </div>
                  <p className="font-bold text-lg text-gray-700">+{reward.hearts}</p>
                  <p className="text-xs text-gray-500">Hearts</p>
                </motion.div>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={onClose}
              className="w-full bg-green-500 border-green-600 hover:bg-green-400"
            >
              CONTINUE
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
