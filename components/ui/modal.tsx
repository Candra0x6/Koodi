"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

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
