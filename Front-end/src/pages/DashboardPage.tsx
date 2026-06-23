import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useEvolution } from '@/features/reports/hooks/useReports'
import { BalanceCard } from '@/features/dashboard/components/BalanceCard'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.name?.split(' ')[0] ?? 'usuário'

  // Busca os últimos 6 meses
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const startMonth = currentMonth - 5 <= 0 ? currentMonth - 5 + 12 : currentMonth - 5
  const startYear = currentMonth - 5 <= 0 ? currentYear - 1 : currentYear

  const evolutionQuery = useEvolution({
    startMonth,
    startYear,
    endMonth: currentMonth,
    endYear: currentYear,
  })

  return (
    <div className="min-h-full bg-[#09090B]">

      {/* Header */}
      <header className="px-8 py-8 border-b border-[#1F1F26]">
        <div className="max-w-[1400px] mx-auto flex items-end justify-between gap-6">
          <div>
            <h1 className="text-[24px] font-semibold text-[#F4F4F5] tracking-tight">
              Olá, {firstName} 
            </h1>
            <p className="text-[14px] text-[#71717A] mt-1">
              Aqui está o resumo das suas finanças.
            </p>
          </div>

          <div className="h-9 w-[160px] rounded-lg bg-[#13131A] border border-[#27272A]
                          flex items-center justify-center text-[13px] text-[#71717A]">
            Filtro de mês
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="px-8 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-12 gap-5">

            <BalanceCard
              evolution={evolutionQuery.data?.items ?? []}
              isLoading={evolutionQuery.isLoading}
            />

            {/* Restantes ainda como placeholder */}
            <div className="col-span-12 lg:col-span-4 h-[220px] bg-[#13131A] border border-[#1F1F26] rounded-2xl
                            flex items-center justify-center text-[#52525B] text-[13px]">
              Card de orçamento
            </div>

            <div className="col-span-12 lg:col-span-7 h-[340px] bg-[#13131A] border border-[#1F1F26] rounded-2xl
                            flex items-center justify-center text-[#52525B] text-[13px]">
              Despesas por categoria
            </div>

            <div className="col-span-12 lg:col-span-5 h-[340px] bg-[#13131A] border border-[#1F1F26] rounded-2xl
                            flex items-center justify-center text-[#52525B] text-[13px]">
              Transações recentes
            </div>

            <div className="col-span-12 h-[280px] bg-[#13131A] border border-[#1F1F26] rounded-2xl
                            flex items-center justify-center text-[#52525B] text-[13px]">
              Fluxo de caixa
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}