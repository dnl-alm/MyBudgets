import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { useEvolution, useByCategory } from '@/features/reports/hooks/useReports'
import { ByCategoryCard } from '@/features/dashboard/components/ByCategoryCard'
import { CashFlowCard } from '@/features/dashboard/components/CashFlowCard'
import { MonthSelector } from '@/shared/components/ui/MonthSelector'
import {
  resolveBudgetPeriod,
  shiftPeriod,
  formatPeriod,
} from '@/features/budgets/utils/budget-period'
import { getMonthRange } from '@/shared/lib/date-utils'
import type { TransactionType } from '@/features/transactions/types'

export function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [byCategoryType, setByCategoryType] = useState<TransactionType>('EXPENSE')

  const period = resolveBudgetPeriod(
    searchParams.get('month'),
    searchParams.get('year'),
  )

  useEffect(() => {
    if (!searchParams.get('month') || !searchParams.get('year')) {
      setSearchParams(
        { month: String(period.month), year: String(period.year) },
        { replace: true },
      )
    }
  }, [searchParams, setSearchParams, period.month, period.year])

  const navigatePeriod = (delta: number) => {
    const next = shiftPeriod(period, delta)
    setSearchParams({ month: String(next.month), year: String(next.year) })
  }

  // ─── Queries ─────────────────────────────────────────────────────────────

  // Evolução: últimos 12 meses contando o período selecionado
  // Calculamos a partir do período selecionado, não da data atual
  const evolutionRange = getMonthRange(
    12,
    new Date(period.year, period.month - 1, 1),
  )

  const evolutionQuery = useEvolution(evolutionRange)

  const byCategoryQuery = useByCategory({
    month: period.month,
    year: period.year,
    type: byCategoryType,
  })

  // ─── Cálculos derivados ──────────────────────────────────────────────────

  const evolution = evolutionQuery.data?.items ?? []

  // Acha o item do mês selecionado dentro da evolução para os cards de KPI
  const currentMonthData = evolution.find(
    (item) => item.month === period.month && item.year === period.year,
  )

  const totalIncome = currentMonthData?.totalIncome ?? 0
  const totalExpense = currentMonthData?.totalExpense ?? 0
  const balance = totalIncome - totalExpense

  return (
    <div className="min-h-full bg-[#09090B]">

      {/* Header */}
      <header className="px-8 py-8 border-b border-[#1F1F26]">
        <div className="max-w-[1400px] mx-auto flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-[24px] font-semibold text-[#F4F4F5] tracking-tight">
              Relatórios
            </h1>
            <p className="text-[14px] text-[#71717A] mt-1">
              Visualize seus dados financeiros por período.
            </p>
          </div>

          <MonthSelector
            month={period.month}
            year={period.year}
            label={formatPeriod(period)}
            onPrevious={() => { navigatePeriod(-1) }}
            onNext={() => { navigatePeriod(1) }}
          />
        </div>
      </header>

      {/* Conteúdo */}
      <div className="px-8 py-8">
        <div className="max-w-[1400px] mx-auto space-y-5">

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard
              label="Receitas"
              value={totalIncome}
              icon={<TrendingUp size={18} />}
              color="#4ADE80"
              isLoading={evolutionQuery.isLoading}
            />
            <KpiCard
              label="Despesas"
              value={totalExpense}
              icon={<TrendingDown size={18} />}
              color="#F87171"
              isLoading={evolutionQuery.isLoading}
            />
            <KpiCard
              label="Saldo"
              value={balance}
              icon={<Wallet size={18} />}
              color={balance >= 0 ? '#A78BFA' : '#F87171'}
              isLoading={evolutionQuery.isLoading}
              isBalance
            />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-12 gap-5">
            <ByCategoryCard
              month={period.month}
              year={period.year}
              data={byCategoryQuery.data}
              isLoading={byCategoryQuery.isLoading}
              selectedType={byCategoryType}
              onTypeChange={setByCategoryType}
            />

            <CashFlowCard
              evolution={evolution}
              isLoading={evolutionQuery.isLoading}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── KPI Card ───────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  isLoading: boolean
  isBalance?: boolean
}

function KpiCard({ label, value, icon, color, isLoading, isBalance }: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="bg-[#13131A] border border-[#1F1F26] rounded-2xl p-5 animate-pulse">
        <div className="h-3 w-20 bg-[#1F1F26] rounded mb-3" />
        <div className="h-7 w-32 bg-[#1F1F26] rounded" />
      </div>
    )
  }

  const displayValue = isBalance
    ? formatCurrency(value)
    : formatCurrency(Math.abs(value))

  return (
    <div className="bg-[#13131A] border border-[#1F1F26] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ backgroundColor: `${color}1F`, color }}
        >
          {icon}
        </div>
        <span className="text-[12px] font-medium text-[#A1A1AA] uppercase tracking-wider">
          {label}
        </span>
      </div>

      <div
        className="text-[24px] font-bold tracking-tight font-mono"
        style={{ color: isBalance ? color : '#F4F4F5' }}
      >
        {displayValue}
      </div>
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}