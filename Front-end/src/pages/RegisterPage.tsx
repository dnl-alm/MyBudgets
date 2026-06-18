import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useRegister } from '@/features/auth/hooks/useAuth'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { ApiError } from '@/shared/lib/http'
import type { RegisterRequest } from '@/features/auth/types'

export function RegisterPage() {
  const register_ = useRegister()
  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm<RegisterRequest & { confirmPassword: string }>()
  const password = watch('password')

  const onSubmit = (data: RegisterRequest & { confirmPassword: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _confirm, ...payload } = data
    register_.mutate(payload, {
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.status === 409) {
            setError('email', { message: 'Este e-mail já está em uso.' })
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

        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="w-13 h-13 rounded-[14px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #40C4FF 100%)', boxShadow: '0 0 20px rgba(0,230,118,0.3)' }}
          >
            <span className="font-extrabold text-lg text-[#0A0D12] tracking-tight">MB</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Criar conta</h1>
          <p className="text-sm text-text-secondary">Comece a controlar seus gastos hoje</p>
        </div>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-5" noValidate>
          <Input
            label="Nome completo" type="text" autoComplete="name" autoFocus required
            placeholder="João Silva" error={errors.name?.message}
            {...register('name', {
              required: 'Nome é obrigatório.',
              minLength: { value: 2, message: 'Mínimo de 2 caracteres.' },
            })}
          />

          <Input
            label="E-mail" type="email" autoComplete="email" required
            placeholder="seu@email.com" error={errors.email?.message}
            {...register('email', {
              required: 'E-mail é obrigatório.',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido.' },
            })}
          />

          <Input
            label="Senha" type="password" autoComplete="new-password" required
            placeholder="••••••••" hint="Mínimo de 8 caracteres." error={errors.password?.message}
            {...register('password', {
              required: 'Senha é obrigatória.',
              minLength: { value: 8, message: 'Mínimo de 8 caracteres.' },
            })}
          />

          <Input
            label="Confirmar senha" type="password" autoComplete="new-password" required
            placeholder="••••••••" error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirme sua senha.',
              validate: (value) => value === password || 'As senhas não coincidem.',
            })}
          />

          {errors.root && (
            <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-[10px] px-4 py-3" role="alert">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" isLoading={register_.isPending}>
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Já tem conta?{' '}
          <Link to="/login" className="text-accent font-medium hover:text-accent-hover">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}