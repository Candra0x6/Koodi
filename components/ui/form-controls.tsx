"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

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
