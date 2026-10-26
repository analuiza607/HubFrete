import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Grid3x3, ChevronDown, Bell, Settings, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, getRoleBadgeColor, getRoleLabel } from '@/lib/utils'
import { AppLauncherMenu } from './AppLauncherMenu'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLauncher, setShowLauncher] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/30">
              <Grid3x3 className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg gradient-text">Hub Central</span>
              <p className="text-[10px] text-muted-foreground -mt-0.5 font-medium tracking-wide uppercase">Frete BID</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* App Launcher button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLauncher(!showLauncher)}
              className={cn(
                'rounded-xl relative',
                showLauncher && 'bg-secondary text-foreground'
              )}
              title="Lançador de aplicativos"
            >
              <Grid3x3 className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="rounded-xl relative" title="Notificações">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
            </Button>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 h-10 px-3 rounded-xl hover:bg-secondary/80 transition-all duration-200 group"
              >
                <Avatar name={user?.name ?? 'U'} size="sm" />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-foreground leading-none">{user?.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{user?.email}</p>
                </div>
                <ChevronDown className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform duration-200 hidden md:block',
                  showUserMenu && 'rotate-180'
                )} />
              </button>

              {/* User dropdown menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 glass-card rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-fade-in">
                    {/* User info */}
                    <div className="p-4 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <Avatar name={user?.name ?? 'U'} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                          <Badge
                            className={cn('mt-1.5 text-[10px]', getRoleBadgeColor(user?.role ?? ''))}
                          >
                            {getRoleLabel(user?.role ?? '')}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5">
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                        <UserIcon className="h-4 w-4" /> Meu Perfil
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                        <Settings className="h-4 w-4" /> Configurações
                      </button>
                      <div className="h-px bg-border/50 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sair da conta
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* App Launcher Overlay */}
      {showLauncher && (
        <AppLauncherMenu onClose={() => setShowLauncher(false)} />
      )}
    </>
  )
}
