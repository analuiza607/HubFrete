import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight,
  Building2, ArrowLeft, ShieldCheck, Check
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

const SEGMENTS = [
  { id: 'industria', label: 'Indústria / Manufatura', desc: 'Cargas FTL, matérias-primas e insumos' },
  { id: 'varejo', label: 'Varejo & E-commerce', desc: 'Transferências entre filiais e CDs' },
  { id: 'agronegocio', label: 'Agronegócio', desc: 'Safras, fertilizantes e cargas a granel' },
  { id: 'distribuicao', label: 'Atacado & Distribuidora', desc: 'Cargas regionais e fracionadas' },
]

export default function CadastroPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [segment, setSegment] = useState('industria')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordStrong = password.length >= 8

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!company.trim()) return setError('Informe a razão social ou nome fantasia da empresa.')
    if (password !== confirmPassword) return setError('As senhas não coincidem.')
    if (!passwordStrong) return setError('A senha deve possuir no mínimo 8 caracteres.')

    setLoading(true)
    try {
      await register({
        name: `${name.trim()} (${company.trim()})`,
        email: email.trim().toLowerCase(),
        password,
        role: 'EMBARCADOR' as UserRole
      })
      navigate('/hub')
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao cadastrar empresa. Tente novamente.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-slate-300 rounded-md shadow-xs p-8 animate-fade-in my-8">
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retornar ao Acesso Corporativo
        </Link>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200">
          <div className="h-8 w-8 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-xs tracking-wider">
            FB
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Frete BID Enterprise
            </h1>
            <p className="text-[11px] text-slate-500">
              Credenciamento de Empresa Contratante (Embarcador)
            </p>
          </div>
        </div>

        {/* Form Title */}
        <div className="py-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Cadastro de Novo Embarcador
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre sua organização para iniciar a publicação de cotações em leilão reverso
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Segment Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-700 block uppercase tracking-tight">
              Segmento de Operação
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SEGMENTS.map(item => {
                const isSelected = segment === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSegment(item.id)}
                    className={cn(
                      'p-2.5 rounded border text-left transition-colors',
                      isSelected
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    )}
                  >
                    <div className="text-xs font-semibold text-slate-800">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{item.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nome do Gestor de Logística"
              placeholder="Ex: Carlos Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              icon={<User className="h-3.5 w-3.5" />}
            />
            <Input
              label="Razão Social / Empresa"
              placeholder="Ex: Indústria ABC Ltda"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              icon={<Building2 className="h-3.5 w-3.5" />}
            />
          </div>

          <Input
            label="E-mail Corporativo"
            type="email"
            placeholder="carlos@industriaabc.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="h-3.5 w-3.5" />}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Senha de Acesso"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={<Lock className="h-3.5 w-3.5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              }
            />
            <Input
              label="Confirmar Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              icon={<Lock className="h-3.5 w-3.5" />}
            />
          </div>

          <Button type="submit" className="w-full mt-2" loading={loading}>
            Concluir Cadastro Corporativo
          </Button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          <span>Já possui cadastro ativo? </span>
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Acessar o Portal
          </Link>
        </div>
      </div>
    </div>
  )
}
