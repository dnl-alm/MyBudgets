import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { User, Mail } from 'lucide-react'
import { useRegister } from '@/features/auth/hooks/useAuth'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { AuthBrandingDashboard } from '@/features/auth/components/AuthBrandingDashboard'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { ApiError } from '@/shared/lib/http'
import type { RegisterRequest } from '@/features/auth/types'

export function RegisterPage() {
  const register_ = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<RegisterRequest & { confirmPassword: string }>()

  const password = watch('password')

  const onSubmit = (data: RegisterRequest & { confirmPassword: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _confirm, ...payload } = data
    register_.mutate(payload, {
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.status === 409) {
            setError('email', { message: 'Este e-mail já está cadastrado.' })
          } else {
            setError('root', { message: error.message })
          }
        }
      },
    })
  }

  return (
    <AuthLayout branding={<AuthBrandingDashboard />}>

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

      <div className="mb-8">
        <h1 className="text-[26px] font-semibold text-[#F4F4F5] tracking-tight leading-tight">
          Criar sua conta
        </h1>
        <p className="text-[14px] text-[#71717A] mt-2">
          É rápido e fácil
        </p>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        noValidate
        className="space-y-5"
      >
        <Input
          label="Nome completo"
          type="text"
          autoComplete="name"
          autoFocus
          placeholder="Seu nome"
          leftIcon={<User size={16} />}
          error={errors.name?.message}
          {...register('name', {
            required: 'Informe seu nome.',
            minLength: { value: 2, message: 'Mínimo 2 caracteres.' },
          })}
        />

        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
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
          autoComplete="new-password"
          placeholder="••••••••"
          hint="Mínimo de 8 caracteres com letras e números"
          error={errors.password?.message}
          {...register('password', {
            required: 'Crie uma senha.',
            minLength: { value: 8, message: 'Mínimo 8 caracteres.' },
          })}
        />

        <PasswordInput
          label="Confirmar senha"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Confirme sua senha.',
            validate: (v) => v === password || 'As senhas não coincidem.',
          })}
        />

        {errors.root && (
          <div className="bg-[#F87171]/8 border border-[#F87171]/15 rounded-lg px-3.5 py-2.5">
            <p className="text-[13px] text-[#FCA5A5]">{errors.root.message}</p>
          </div>
        )}

        <Button type="submit" fullWidth size="lg" isLoading={register_.isPending} className="mt-2">
          Criar conta
        </Button>
      </form>

      <p className="text-center text-[14px] text-[#71717A] mt-8">
        Já tem uma conta?{' '}
        <Link to="/login" className="text-[#A78BFA] hover:text-[#C4B5FD] font-medium transition-colors">
          Fazer login
        </Link>
      </p>

      <p className="text-center text-[12px] text-[#52525B] mt-12 leading-relaxed">
        Ao criar uma conta, você concorda com os{' '}
        <a href="#" className="text-[#A78BFA] hover:text-[#C4B5FD]">Termos de Uso</a>
        {' '}e{' '}
        <a href="#" className="text-[#A78BFA] hover:text-[#C4B5FD]">Política de Privacidade</a>.
      </p>

    </AuthLayout>
  )
}