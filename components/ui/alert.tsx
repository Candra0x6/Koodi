"use client"

import { cn } from "@/lib/utils"

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
