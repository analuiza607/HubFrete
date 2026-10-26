import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'muted' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium border leading-tight select-none',
        {
          'bg-slate-100 text-slate-700 border-slate-200': variant === 'default',
          'bg-emerald-50 text-emerald-700 border-emerald-200': variant === 'success',
          'bg-amber-50 text-amber-700 border-amber-200': variant === 'warning',
          'bg-blue-50 text-blue-700 border-blue-200': variant === 'info',
          'bg-slate-50 text-slate-500 border-slate-200': variant === 'muted',
          'bg-white text-slate-700 border-slate-300': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
