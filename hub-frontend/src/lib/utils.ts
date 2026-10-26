import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

export function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'EMBARCADOR':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'TRANSPORTADOR':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

export function getRoleLabel(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'Administrador'
    case 'EMBARCADOR':
      return 'Embarcador'
    case 'TRANSPORTADOR':
      return 'Transportador'
    default:
      return role
  }
}
