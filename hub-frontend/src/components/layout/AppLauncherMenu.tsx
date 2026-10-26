import { useNavigate } from 'react-router-dom'
import { Truck, LayoutGrid, FileText, BarChart3, Package, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const MODULES = [
  { icon: Truck, label: 'Leilão de Frete', path: '/modulos/leilao-frete', active: true, color: 'text-indigo-400' },
  { icon: Package, label: 'Gestão de Frota', path: '#', active: false, color: 'text-blue-400' },
  { icon: FileText, label: 'Faturamento', path: '#', active: false, color: 'text-emerald-400' },
  { icon: BarChart3, label: 'Relatórios', path: '#', active: false, color: 'text-amber-400' },
  { icon: LayoutGrid, label: 'Hub Central', path: '/hub', active: true, color: 'text-violet-400' },
  { icon: Settings, label: 'Configurações', path: '#', active: false, color: 'text-slate-400' },
]

interface AppLauncherMenuProps {
  onClose: () => void
}

export function AppLauncherMenu({ onClose }: AppLauncherMenuProps) {
  const navigate = useNavigate()

  const handleClick = (path: string, active: boolean) => {
    if (!active) return
    onClose()
    navigate(path)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-72 glass-card rounded-2xl shadow-2xl shadow-black/50 p-4 animate-fade-in">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Módulos</p>
        <div className="grid grid-cols-3 gap-2">
          {MODULES.map(({ icon: Icon, label, path, active, color }) => (
            <button
              key={label}
              onClick={() => handleClick(path, active)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all duration-200',
                active
                  ? 'hover:bg-secondary/80 cursor-pointer'
                  : 'opacity-40 cursor-not-allowed'
              )}
            >
              <div className={cn(
                'h-10 w-10 rounded-xl flex items-center justify-center',
                active ? 'bg-secondary' : 'bg-muted'
              )}>
                <Icon className={cn('h-5 w-5', active ? color : 'text-muted-foreground')} />
              </div>
              <span className="text-[10px] font-medium text-foreground/80 leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
