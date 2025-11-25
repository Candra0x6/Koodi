'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  children: React.ReactNode
  content: string
}

function Tooltip({ children, content }: TooltipProps) {
  return (
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
}

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function TooltipTrigger({ ...props }: React.ComponentProps<'button'>) {
  return <button data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({ children, className }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="tooltip-content"
      className={cn(
        'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 w-fit origin-center rounded-md px-3 py-1.5 text-xs text-balance',
        className,
      )}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
