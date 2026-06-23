import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { useLogin } from '@/features/auth/hooks/useAuth'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { AuthBrandingDashboard } from '@/features/auth/components/AuthBrandingDashboard'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { ApiError } from '@/shared/lib/http'
import type { LoginRequest } from '@/features/auth/types'

export function LoginPage() {
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginRequest>()

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
    <AuthLayout branding={<AuthBrandingDashboard />}>

      {/* Logo mobile */}
      <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A78BFA] to-[#7C3AED]
                        flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 12V4l5 6 5-6v8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[15px] font-semibold text-[#E4E4E7] tracking-tight">
          MyBudgets
        </span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-semibold text-[#F4F4F5] tracking-tight leading-tight">
          Bem-vindo de volta <span className="inline-block">👋</span>
        </h1>
        <p className="text-[14px] text-[#71717A] mt-2">
          Faça login para continuar
        </p>
      </div>

      {/* Formulário */}
      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        noValidate
        className="space-y-5"
      >
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="seu@email.com"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Informe seu e-mail.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'E-mail inválido.',
            },
          })}
        />

        <PasswordInput
          label="Senha"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Informe sua senha.',
            minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
          })}
        />

        {errors.root && (
          <div className="bg-[#F87171]/8 border border-[#F87171]/15 rounded-lg px-3.5 py-2.5">
            <p className="text-[13px] text-[#FCA5A5]">{errors.root.message}</p>
          </div>
        )}

        <Button type="submit" fullWidth size="lg" isLoading={login.isPending} className="mt-2">
          Entrar
        </Button>
      </form>

      {/* Link secundário */}
      <p className="text-center text-[14px] text-[#71717A] mt-8">
        Ainda não tem uma conta?{' '}
        <Link to="/register" className="text-[#A78BFA] hover:text-[#C4B5FD] font-medium transition-colors">
          Criar conta
        </Link>
      </p>

      {/* Termos */}
      <p className="text-center text-[12px] text-[#52525B] mt-12 leading-relaxed">
        Ao continuar, você concorda com os{' '}
        <a href="#" className="text-[#A78BFA] hover:text-[#C4B5FD]">Termos de Uso</a>
        {' '}e{' '}
        <a href="#" className="text-[#A78BFA] hover:text-[#C4B5FD]">Política de Privacidade</a>.
      </p>

    </AuthLayout>
  )
}