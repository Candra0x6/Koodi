import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

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

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
