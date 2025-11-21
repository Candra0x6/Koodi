"use client"

import { cn } from "@/lib/utils"

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
