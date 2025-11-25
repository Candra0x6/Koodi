import * as React from 'react'

import { cn } from '@/lib/utils'
import { ref } from 'process'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
          "flex h-12 w-full rounded-2xl border-2 border-border bg-input px-4 py-2 text-sm font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-secondary focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className,
        )}
        ref={ref}
        {...props}
    />
  )
}

export { Input }
  