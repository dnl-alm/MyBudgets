import { PieChart, Pie, Cell } from 'recharts'
import type { BudgetResponse } from '@/features/budgets/types'
import { aggregateBudgets } from '@/features/budgets/utils/budget-aggregations'

interface BudgetSummaryCardProps {
  budgets: BudgetResponse[]
  isLoading: boolean
}

export function BudgetSummaryCard({ budgets, isLoading }: BudgetSummaryCardProps) {
  if (isLoading) return <BudgetSummaryCardSkeleton />
  if (budgets.length === 0) return <BudgetSummaryCardEmpty />

  const totals = aggregateBudgets(budgets)

  const chartData = [
    { name: 'used', value: totals.percentage },
    { name: 'remaining', value: 100 - totals.percentage },
  ]

  return (
    <div className="col-span-12 lg:col-span-4 bg-[#13131A] border border-[#1F1F26] rounded-2xl p-6">
      <div className="flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[12px] font-medium text-[#A1A1AA] uppercase tracking-wider">
            Orçamento do mês
          </span>
        </div>

        {/* Donut + valor */}
        <div className="flex items-center gap-5 mb-5">

          {/* Donut chart */}
          <div className="relative w-[110px] h-[110px] shrink-0">
            <PieChart width={110} height={110}>
              <Pie
                data={chartData}
                innerRadius={42}
                outerRadius={55}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={totals.isExceeded ? '#F87171' : '#7C3AED'} />
                <Cell fill="#1F1F26" />
              </Pie>
            </PieChart>

            {/* Texto centralizado sobre o donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-[20px] font-bold text-[#F4F4F5] tracking-tight">
                {Math.round(totals.percentage)}%
              </div>
              <div className="text-[10px] text-[#71717A] uppercase tracking-wider">
                utilizado
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="flex-1 min-w-0">
            <div className="text-[20px] font-bold text-[#F4F4F5] tracking-tight font-mono mb-0.5">
              {formatCurrency(totals.totalLimit)}
            </div>
            <div className="text-[11px] text-[#71717A]">
              de {formatCurrency(totals.totalRealized)} gastos
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="h-1.5 bg-[#1F1F26] rounded-full overflow-hidden mb-3">
          <div
            className={[
              'h-full rounded-full transition-all duration-500',
              totals.isExceeded
                ? 'bg-gradient-to-r from-[#F87171] to-[#EF4444]'
                : 'bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]',
            ].join(' ')}
            style={{ width: `${totals.percentage}%` }}
          />
        </div>

        {/* Restante */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[11px] text-[#71717A]">
            {totals.isExceeded ? 'Ultrapassado em' : 'Restante'}
          </span>
          <span className={[
            'text-[13px] font-semibold font-mono',
            totals.isExceeded ? 'text-[#F87171]' : 'text-[#4ADE80]',
          ].join(' ')}>
            {formatCurrency(Math.abs(totals.totalRemaining))}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Estados auxiliares ─────────────────────────────────────────────────────

function BudgetSummaryCardSkeleton() {
  return (
    <div className="col-span-12 lg:col-span-4 h-[220px] bg-[#13131A] border border-[#1F1F26] rounded-2xl p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-3 w-32 bg-[#1F1F26] rounded" />
        <div className="flex items-center gap-4">
          <div className="w-[110px] h-[110px] rounded-full bg-[#1F1F26]" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 bg-[#1F1F26] rounded" />
            <div className="h-3 w-24 bg-[#1F1F26] rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

function BudgetSummaryCardEmpty() {
  return (
    <div className="col-span-12 lg:col-span-4 h-[220px] bg-[#13131A] border border-[#1F1F26] rounded-2xl
                    flex flex-col items-center justify-center gap-2 p-6">
      <p className="text-[13px] text-[#71717A] text-center">
        Nenhum orçamento criado<br />para este mês.
      </p>
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