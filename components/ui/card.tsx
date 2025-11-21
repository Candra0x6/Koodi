"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

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

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

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
