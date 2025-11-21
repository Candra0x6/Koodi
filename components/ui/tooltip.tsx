"use client"

import { cn } from "@/lib/utils"

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
