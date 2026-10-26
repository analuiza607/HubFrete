import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold text-slate-700 block tracking-tight"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 shrink-0 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'flex h-8 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-900',
              'placeholder:text-slate-400',
              'focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
              icon && 'pl-8',
              rightIcon && 'pr-8',
              error && 'border-rose-500 focus:border-rose-600 focus:ring-rose-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 shrink-0">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
