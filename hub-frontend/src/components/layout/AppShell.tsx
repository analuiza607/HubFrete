import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Grid3x3, ArrowLeft, Truck, Package, FileCheck, BarChart3,
  Settings, LogOut, ChevronDown, Bell, Building2, Server,
  FileText, Users, History, Layers
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, getInitials } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
  breadcrumb?: string
}

export function AppShell({ children, breadcrumb }: AppShellProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Navegação interna do Módulo 01 (Leilão de Fretes)
  const moduleNavItems = [
    {
      title: 'Mural de Cotações',
      path: '/modulos/leilao-frete',
      icon: Truck,
      active: true,
      badge: '3 ativas',
    },
    {
      title: 'Lances Recebidos',
      path: '#',
      icon: Layers,
      active: false,
      disabled: true,
      badge: '24 lances',
    },
    {
      title: 'Transportadoras Homologadas',
      path: '#',
      icon: Users,
      active: false,
      disabled: true,
      badge: '2.418',
    },
    {
      title: 'Histórico & Adjudicações',
      path: '#',
      icon: History,
      active: false,
      disabled: true,
    },
  ]

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* ─── SIDEBAR OPERACIONAL DO MÓDULO ──────────────────────────────── */}
      <aside className="w-60 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
        <div>
          {/* Botão de Retorno ao Hub Central (Lançador de Módulos) */}
          <div className="p-3 border-b border-slate-800">
            <Link
              to="/hub"
              className="w-full flex items-center justify-between px-3 py-2 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold transition-colors border border-slate-700/60 group"
              title="Voltar à janela central de seleção de módulos"
            >
              <span className="flex items-center gap-2">
                <Grid3x3 className="h-4 w-4 text-blue-400 group-hover:scale-105 transition-transform" />
                <span>Hub de Módulos</span>
              </span>
              <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          </div>

          {/* Cabeçalho do Módulo Ativo */}
          <div className="px-4 py-3 border-b border-slate-800/80">
            <span className="text-[10px] font-mono text-blue-400 font-semibold uppercase tracking-wider block">
              MÓDULO 01 • ATIVO
            </span>
            <span className="font-bold text-white text-sm block truncate">
              Leilão de Fretes
            </span>
            <span className="text-[11px] text-slate-400 block truncate mt-0.5">
              Portal do Embarcador
            </span>
          </div>

          {/* Menu de Funcionalidades do Módulo */}
          <nav className="p-2 space-y-0.5">
            <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Operações do Módulo
            </div>
            {moduleNavItems.map((item) => {
              const Icon = item.icon
              if (item.disabled) {
                return (
                  <div
                    key={item.title}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-slate-500 cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <Icon className="h-4 w-4 text-slate-600 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </span>
                    {item.badge && (
                      <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.2 rounded border border-slate-700/60 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.title}
                  to={item.path}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors',
                    item.active
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className={cn('h-4 w-4 shrink-0', item.active ? 'text-white' : 'text-slate-400')} />
                    <span className="truncate">{item.title}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.2 rounded font-mono font-bold',
                        item.active
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-800 text-blue-400 border border-slate-700'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar do Módulo */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Server className="h-3 w-3 text-emerald-400" />
              API Axum Core
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-medium">Online</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
            <span>Leilão Spot v2.4</span>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Sair do sistema"
            >
              <LogOut className="h-3 w-3" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* ─── CONTEÚDO PRINCIPAL (Topbar + Conteúdo do Módulo) ─────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Lado Esquerdo: Identificação & Botão Voltar ao Hub */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/hub"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors"
            >
              <Grid3x3 className="h-3.5 w-3.5 text-slate-500" />
              <span>Hub Central</span>
            </Link>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-800 truncate">
              {user?.name || 'Embarcador Corporativo'}
            </span>
            <span className="text-slate-300 hidden md:inline">•</span>
            <span className="text-xs text-slate-500 truncate hidden md:inline">
              Paulínia (SP) • CNPJ: 12.345.678/0001-90
            </span>
            {breadcrumb && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-blue-600 font-medium truncate">
                  {breadcrumb}
                </span>
              </>
            )}
          </div>

          {/* Lado Direito */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
              title="Avisos do Leilão"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Menu do Usuário */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded hover:bg-slate-100 transition-colors"
              >
                <div className="h-7 w-7 rounded bg-slate-800 text-white font-semibold text-xs flex items-center justify-center">
                  {getInitials(user?.name || 'Embarcador')}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-medium text-slate-900 block leading-none">
                    {user?.name?.split(' ')[0] || 'Usuário'}
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                    {user?.role || 'EMBARCADOR'}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-md shadow-md z-50 text-xs py-1 animate-fade-in">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <Badge variant="info" className="mt-1">
                        {user?.role || 'EMBARCADOR'}
                      </Badge>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => { setShowUserMenu(false); navigate('/hub'); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                      >
                        <Grid3x3 className="h-3.5 w-3.5 text-slate-400" />
                        Ir para Hub Central (Módulos)
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Encerrar Sessão
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Área de Trabalho do Módulo */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
