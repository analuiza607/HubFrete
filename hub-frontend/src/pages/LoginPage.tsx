import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname ?? '/hub'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Credenciais corporativas inválidas.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-300 rounded-md shadow-xs p-8 animate-fade-in">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 pb-6 border-b border-slate-200">
          <div className="h-9 w-9 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-wider">
            FB
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Frete BID Enterprise
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Portal de Gestão de Fretes para Embarcadores
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="py-5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Acesso ao Sistema
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Insira suas credenciais corporativas para acessar o painel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <Input
            label="E-mail Corporativo"
            type="email"
            placeholder="nome@empresa.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="h-3.5 w-3.5" />}
          />

          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
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

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
              <input type="checkbox" className="rounded border-slate-300 text-slate-900" />
              Lembrar sessão
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Esqueci a senha
            </a>
          </div>

          <Button type="submit" className="w-full mt-2" loading={loading}>
            Acessar Painel do Embarcador
          </Button>
        </form>

        {/* Informações de Demonstração Corporativa */}
        <div className="mt-6 p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
            Acesso Homologado para Demonstração:
          </p>
          <div className="font-mono text-[11px] text-slate-700">
            <div>Usuário: <strong>ana.luiza@empresa.com.br</strong></div>
            <div>Senha: <strong>SenhaForte#2026</strong></div>
          </div>
        </div>

        {/* Rodapé do Login */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Ainda não possui contrato?</span>
          <Link to="/cadastro" className="text-blue-600 hover:underline font-medium">
            Cadastrar Empresa
          </Link>
        </div>
      </div>
    </div>
  )
}
