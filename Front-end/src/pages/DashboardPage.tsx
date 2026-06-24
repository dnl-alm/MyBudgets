import { useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useEvolution, useByCategory } from '@/features/reports/hooks/useReports'
import { useBudgets } from '@/features/budgets/hooks/useBudgets'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'
import { BalanceCard } from '@/features/dashboard/components/BalanceCard'
import { BudgetSummaryCard } from '@/features/dashboard/components/BudgetSummaryCard'
import { ByCategoryCard } from '@/features/dashboard/components/ByCategoryCard'
import { CashFlowCard } from '@/features/dashboard/components/CashFlowCard'
import { getMonthRange } from '@/shared/lib/date-utils'
import type { TransactionType } from '@/features/transactions/types'
import { RecentTransactionsCard } from '@/features/dashboard/components/RecentTransactionsCard'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.name?.split(' ')[0] ?? 'usuário'

  // Período corrente — para budgets e by-category
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  // Últimos 12 meses — para o fluxo de caixa
  const yearRange = getMonthRange(12)

  // Últimos 6 meses — para o gráfico de evolução do balance
  const halfYearRange = getMonthRange(6)

  // ─── Queries ─────────────────────────────────────────────────────────────

  const balanceEvolutionQuery = useEvolution(halfYearRange)
  const cashFlowEvolutionQuery = useEvolution(yearRange)

  const budgetsQuery = useBudgets({
    month: currentMonth,
    year: currentYear,
  })

  const [byCategoryType, setByCategoryType] = useState<TransactionType>('EXPENSE')
  const byCategoryQuery = useByCategory({
    month: currentMonth,
    year: currentYear,
    type: byCategoryType,
  })

  const recentTransactionsQuery = useTransactions(
    undefined,
    { page: 0, size: 5, sort: 'date,desc' },
  )

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full bg-[#09090B]">

      {/* Header */}
      <header className="px-8 py-8 border-b border-[#1F1F26]">
        <div className="max-w-[1400px] mx-auto flex items-end justify-between gap-6">
          <div>
            <h1 className="text-[24px] font-semibold text-[#F4F4F5] tracking-tight">
              Olá, {firstName} 👋
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
              evolution={balanceEvolutionQuery.data?.items ?? []}
              isLoading={balanceEvolutionQuery.isLoading}
            />

            <BudgetSummaryCard
              budgets={budgetsQuery.budgets}
              isLoading={budgetsQuery.isLoading}
            />

            <ByCategoryCard
              month={currentMonth}
              year={currentYear}
              data={byCategoryQuery.data}
              isLoading={byCategoryQuery.isLoading}
              selectedType={byCategoryType}
              onTypeChange={setByCategoryType}
            />

            <RecentTransactionsCard
              transactions={recentTransactionsQuery.transactions}
              isLoading={recentTransactionsQuery.isLoading}
            />

            <CashFlowCard
              evolution={cashFlowEvolutionQuery.data?.items ?? []}
              isLoading={cashFlowEvolutionQuery.isLoading}
            />

          </div>
        </div>
      </div>
    </div>
  )
}