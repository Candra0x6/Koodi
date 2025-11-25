'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
}

function Checkbox({
  checked = false,
  onCheckedChange,
  label,
  className,
  ...props
}: CheckboxProps) {
  const [isChecked, setIsChecked] = React.useState(checked)

  const handleChange = () => {
    const newState = !isChecked
    setIsChecked(newState)
    onCheckedChange?.(newState)
  }

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={isChecked}
        onClick={handleChange}
        data-slot="checkbox"
        className={cn(
          "peer h-6 w-6 shrink-0 rounded-lg border-2 border-border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center transition-all",
          isChecked ? "bg-secondary border-secondary text-white" : "bg-white",
          className,
        )}
        {...props}
      >
        {isChecked && <Check className="h-4 w-4 stroke-4" />}
      </button>
      {label && (
        <label
          className="text-sm font-bold text-muted-foreground cursor-pointer select-none"
          onClick={handleChange}
        >
          {label}
        </label>
      )}
    </div>
  )
}

export { Checkbox }
