import * as React from 'react'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

function Avatar({ name, size = 'md', className, ...props }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  return (
    <div
      className={cn(
        'rounded-full gradient-brand flex items-center justify-center font-semibold text-white shrink-0 select-none ring-2 ring-primary/20',
        sizeClasses[size],
        className
      )}
      title={name}
      {...props}
    >
      {getInitials(name)}
    </div>
  )
}

export { Avatar }
