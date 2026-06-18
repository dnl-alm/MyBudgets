import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useLogin } from '@/features/auth/hooks/useAuth'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { ApiError } from '@/shared/lib/http'
import type { LoginRequest } from '@/features/auth/types'

export function LoginPage() {
  const login = useLogin()
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginRequest>()

  const onSubmit = (data: LoginRequest) => {
    login.mutate(data, {
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.status === 401) {
            setError('password', { message: 'E-mail ou senha incorretos.' })
          } else {
            setError('root', { message: error.message })
          }
        }
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-base"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 0%, rgba(0,230,118,0.04) 0%, transparent 60%),
          radial-gradient(#1E2A3A 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 32px 32px',
      }}
    >
      <div className="w-full max-w-[420px] bg-bg-surface border border-border rounded-[20px] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="w-13 h-13 rounded-[14px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #40C4FF 100%)', boxShadow: '0 0 20px rgba(0,230,118,0.3)' }}
          >
            <span className="font-extrabold text-lg text-[#0A0D12] tracking-tight">MB</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Bem-vindo de volta</h1>
          <p className="text-sm text-text-secondary">Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-5" noValidate>
          <Input
            label="E-mail" type="email" autoComplete="email" autoFocus required
            placeholder="seu@email.com" error={errors.email?.message}
            {...register('email', {
              required: 'E-mail é obrigatório.',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido.' },
            })}
          />

          <Input
            label="Senha" type="password" autoComplete="current-password" required
            placeholder="••••••••" error={errors.password?.message}
            {...register('password', {
              required: 'Senha é obrigatória.',
              minLength: { value: 6, message: 'Mínimo de 6 caracteres.' },
            })}
          />

          {errors.root && (
            <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-[10px] px-4 py-3" role="alert">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" isLoading={login.isPending}>
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Não tem conta?{' '}
          <Link to="/register" className="text-accent font-medium hover:text-accent-hover">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </div>
  )
}