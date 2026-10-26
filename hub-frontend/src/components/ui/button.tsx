import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-slate-900 text-white hover:bg-slate-800 border border-slate-900 shadow-sm',
        primary:
          'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-sm',
        destructive:
          'bg-rose-600 text-white hover:bg-rose-700 border border-rose-600 shadow-sm',
        outline:
          'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm',
        secondary:
          'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200',
        ghost:
          'hover:bg-slate-100 hover:text-slate-900 text-slate-600',
        link:
          'text-blue-600 underline-offset-4 hover:underline p-0 h-auto font-normal',
      },
      size: {
        default: 'h-8 px-3.5 rounded-md',
        sm: 'h-7 px-2.5 text-[11px] rounded',
        lg: 'h-9 px-4 text-sm rounded-md',
        icon: 'h-8 w-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-3.5 w-3.5 text-current shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
