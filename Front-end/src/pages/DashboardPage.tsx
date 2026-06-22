import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { Button } from '@/shared/components/ui/Button'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  return (
    <div className="p-8 text-text-primary">
      <h1 className="text-2xl font-bold">Dashboard — em construção 🚧</h1>
      <p className="text-text-secondary mt-2">
        Olá, <strong className="text-text-primary">{user?.name ?? 'usuário'}</strong>! Autenticação funcionando ✅
      </p>
      <div className="mt-6">
        <Button variant="danger" onClick={logout}>Sair</Button>
      </div>
    </div>
  )
}