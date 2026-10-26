import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Truck, Package, FileCheck, BarChart3, Clock,
  ShieldCheck, FileText, Settings, Search, ArrowRight,
  LogOut, ChevronDown, Building2, Lock, Sparkles, Layers
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'

interface SystemModule {
  id: string
  code: string
  title: string
  category: 'OPERACAO' | 'FISCAL' | 'GESTAO' | 'ADMIN'
  categoryLabel: string
  desc: string
  icon: typeof Truck
  status: 'ACTIVE' | 'PILOT' | 'SOON'
  statusLabel: string
  badgeVariant: 'success' | 'warning' | 'muted' | 'info'
  path?: string
  metricChip?: string
}

const SYSTEM_MODULES: SystemModule[] = [
  {
    id: 'leilao',
    code: 'MOD-01',
    title: 'Leilão de Fretes & Cotações',
    category: 'OPERACAO',
    categoryLabel: 'Operação & Cargas',
    desc: 'Publicação de cargas FTL/LTL, disputa reversa em tempo real e adjudicação com a menor tarifa qualificada.',
    icon: Truck,
    status: 'ACTIVE',
    statusLabel: 'Disponível',
    badgeVariant: 'success',
    path: '/modulos/leilao-frete',
    metricChip: '3 leilões em disputa',
  },
  {
    id: 'tracking',
    code: 'MOD-02',
    title: 'Tracking & Gestão de Cargas',
    category: 'OPERACAO',
    categoryLabel: 'Operação & Cargas',
    desc: 'Telemetria das cargas em trânsito, controle de tempo de viagem e comprovação digital de entrega (POD).',
    icon: Package,
    status: 'PILOT',
    statusLabel: 'Fase Piloto',
    badgeVariant: 'warning',
    metricChip: 'Piloto controlado',
  },
  {
    id: 'auditoria',
    code: 'MOD-03',
    title: 'Auditoria de CT-e & Faturas',
    category: 'FISCAL',
    categoryLabel: 'Fiscal & Financeiro',
    desc: 'Conferência automática entre o CT-e emitido pela transportadora e a cotação fechada no leilão.',
    icon: FileCheck,
    status: 'SOON',
    statusLabel: 'Em Breve',
    badgeVariant: 'muted',
    metricChip: 'Integração SEFAZ',
  },
  {
    id: 'patio',
    code: 'MOD-04',
    title: 'Gestão de Pátio & Docas (YMS)',
    category: 'OPERACAO',
    categoryLabel: 'Operação & Cargas',
    desc: 'Agendamento de janelas para carga e descarga nas docas das fábricas e centros de distribuição.',
    icon: Clock,
    status: 'SOON',
    statusLabel: 'Em Breve',
    badgeVariant: 'muted',
    metricChip: 'Controle de Docas',
  },
  {
    id: 'analytics',
    code: 'MOD-05',
    title: 'Analytics, BI & SLAs de Frete',
    category: 'GESTAO',
    categoryLabel: 'Inteligência & Gestão',
    desc: 'Painéis executivos de pontualidade por transportadora, custo por tonelada/km e mapa de deságio.',
    icon: BarChart3,
    status: 'SOON',
    statusLabel: 'Em Breve',
    badgeVariant: 'muted',
    metricChip: 'Relatórios Executivos',
  },
  {
    id: 'homologacao',
    code: 'MOD-06',
    title: 'Homologação de Transportadoras',
    category: 'GESTAO',
    categoryLabel: 'Inteligência & Gestão',
    desc: 'Validação cadastral de RNTRC na ANTT, apólices de seguro RCTR-C e conformidade jurídica.',
    icon: ShieldCheck,
    status: 'SOON',
    statusLabel: 'Em Breve',
    badgeVariant: 'muted',
    metricChip: '2.418 homologadas',
  },
  {
    id: 'contratos',
    code: 'MOD-07',
    title: 'Tabelas & Contratos de Frete',
    category: 'FISCAL',
    categoryLabel: 'Fiscal & Financeiro',
    desc: 'Parametrização de frete spot vs contratado, reajustes de combustível e frete mínimo obrigatório.',
    icon: FileText,
    status: 'SOON',
    statusLabel: 'Em Breve',
    badgeVariant: 'muted',
    metricChip: 'Gestão Contratual',
  },
  {
    id: 'configuracoes',
    code: 'MOD-08',
    title: 'Parâmetros Gerais & Acessos',
    category: 'ADMIN',
    categoryLabel: 'Administração',
    desc: 'Centros de custo, matriz de aprovação de fretes, perfis de usuários e logs de auditoria.',
    icon: Settings,
    status: 'PILOT',
    statusLabel: 'Configurado',
    badgeVariant: 'info',
    metricChip: 'Acesso Admin',
  },
]

export default function HubPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredModules = SYSTEM_MODULES.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchTerm.toLowerCase())

    if (selectedCategory === 'ALL') return matchesSearch
    return matchesSearch && m.category === selectedCategory
  })

  const activeCount = SYSTEM_MODULES.filter((m) => m.status === 'ACTIVE').length

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* ─── TOPBAR INSTITUCIONAL (SEM SIDEBAR) ────────────────────────── */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Identificação do Hub */}
        <div className="flex items-center gap-3.5">
          <div className="h-9 w-9 rounded-md bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-xs">
            FB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                Frete BID
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-700 font-medium">
                Hub Central do Embarcador
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Portal Corporativo de Módulos & Aplicações
            </p>
          </div>
        </div>

        {/* Empresa & Usuário */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 border-r border-slate-200 pr-4">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">Indústria Paulínia Ltda</span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono font-medium">
              PROD
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-md bg-slate-800 text-white font-semibold text-xs flex items-center justify-center">
                {getInitials(user?.name || 'Embarcador')}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-semibold text-slate-900 block leading-tight">
                  {user?.name?.split(' ')[0] || 'Usuário'}
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                  {user?.role || 'EMBARCADOR'}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-md shadow-lg z-50 text-xs py-1.5 animate-fade-in">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email}</p>
                    <Badge variant="info" className="mt-2">
                      {user?.role || 'EMBARCADOR'}
                    </Badge>
                  </div>

                  <div className="pt-1.5">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium transition-colors"
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

      {/* ─── CORPO CENTRAL (Espaçamento Fluido e Amplo) ─────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-10 space-y-8">
        {/* Banner de Boas-Vindas */}
        <div className="bg-white p-7 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                PORTAL CENTRAL • LAUNCHPAD
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {activeCount} de {SYSTEM_MODULES.length} Aplicações Habilitadas
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight pt-1">
              Seletor de Módulos Corporativos
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Escolha o módulo desejado para acessar a interface dedicada da aplicação. Cada módulo possui ambiente e regras operacionais próprias.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              size="lg"
              onClick={() => navigate('/modulos/leilao-frete')}
              className="text-xs font-semibold px-5 py-2.5 h-10 shadow-xs"
            >
              <Truck className="h-4 w-4 mr-2" />
              Acessar Leilão de Fretes
            </Button>
          </div>
        </div>

        {/* Barra de Filtros e Busca Rápida */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs">
          {/* Categorias */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'Todos os Módulos' },
              { id: 'OPERACAO', label: 'Operação & Cargas' },
              { id: 'FISCAL', label: 'Fiscal & Financeiro' },
              { id: 'GESTAO', label: 'Inteligência & Gestão' },
              { id: 'ADMIN', label: 'Administração' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors',
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar aplicação ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8.5 pl-9 pr-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
            />
          </div>
        </div>

        {/* ─── GRADE DE MÓDULOS (Fluida, Ampla e Confortável) ─────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredModules.map((item) => {
            const Icon = item.icon
            const isActive = item.status === 'ACTIVE'

            return (
              <div
                key={item.id}
                className={cn(
                  'bg-white rounded-lg border p-6 flex flex-col justify-between transition-all select-none',
                  isActive
                    ? 'border-slate-300 shadow-xs hover:border-slate-400 hover:shadow-md'
                    : 'border-slate-200 bg-slate-50/50 opacity-80'
                )}
              >
                {/* Topo do Card */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div
                      className={cn(
                        'h-11 w-11 rounded-lg flex items-center justify-center shrink-0 border transition-transform',
                        isActive
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold text-slate-400">
                        {item.code}
                      </span>
                      <Badge variant={item.badgeVariant}>
                        {item.statusLabel}
                      </Badge>
                    </div>
                  </div>

                  {/* Categoria */}
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {item.categoryLabel}
                  </span>

                  {/* Título */}
                  <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                    {item.title}
                  </h3>

                  {/* Descrição com altura mínima uniforme */}
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed min-h-[3.75rem] line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                {/* Rodapé com espaçamento interno e divisor */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 truncate max-w-[140px]">
                    {item.metricChip}
                  </span>

                  {isActive ? (
                    <Button
                      size="sm"
                      onClick={() => item.path && navigate(item.path)}
                      className="text-xs font-semibold px-3 py-1.5 h-8 shadow-xs"
                    >
                      Abrir Módulo
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium inline-flex items-center gap-1.5 py-1">
                      <Lock className="h-3.5 w-3.5" />
                      Bloqueado
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Rodapé Institucional */}
      <footer className="py-5 border-t border-slate-200 bg-white text-center text-xs text-slate-400 mt-auto">
        <p>Frete BID Enterprise • Hub Central de Autenticação e Lançador de Módulos • Versão 2.4</p>
      </footer>
    </div>
  )
}
