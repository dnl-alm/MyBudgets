import { Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react'
import { useState } from 'react'
import type { EvolutionItem } from '@/features/reports/types'

interface BalanceCardProps {
  evolution: EvolutionItem[]
  isLoading: boolean
}

export function BalanceCard({ evolution, isLoading }: BalanceCardProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (isLoading) {
    return <BalanceCardSkeleton />
  }

  // Pega o mês atual e anterior
  const currentMonth = evolution[evolution.length - 1]
  const previousMonth = evolution[evolution.length - 2]

  if (!currentMonth) {
    return <BalanceCardEmpty />
  }

  const balance = currentMonth.balance
  const income = currentMonth.totalIncome
  const expense = currentMonth.totalExpense

  // Calcula variação percentual em relação ao mês anterior
  const previousBalance = previousMonth?.balance ?? 0
  const variation = previousBalance !== 0
    ? ((balance - previousBalance) / Math.abs(previousBalance)) * 100
    : 0

  const isPositive = variation >= 0

  return (
    <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-[#1A0F2E] via-[#13131A] to-[#0F0F14]
                    border border-[#1F1F26] rounded-2xl p-6
                    relative overflow-hidden">

      {/* Glow decorativo */}
      <div className="absolute -top-20 -right-20 w-[300px] h-[300px]
                      bg-[#7C3AED]/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#A1A1AA] uppercase tracking-wider">
              Saldo disponível
            </span>
            <button
              onClick={() => setIsVisible((v) => !v)}
              className="text-[#52525B] hover:text-[#A1A1AA] transition-colors"
              aria-label={isVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
            >
              {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>

          {previousMonth && (
            <div className={[
              'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold',
              isPositive
                ? 'bg-[#4ADE80]/10 text-[#4ADE80]'
                : 'bg-[#F87171]/10 text-[#F87171]',
            ].join(' ')}>
              {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {isPositive ? '+' : ''}{variation.toFixed(1)}%
            </div>
          )}
        </div>

        {/* Saldo */}
        <div className="text-[36px] font-bold text-[#F4F4F5] tracking-tight font-mono mb-6">
          {isVisible ? formatCurrency(balance) : '••••••••'}
        </div>

        {/* Receitas e Despesas */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-[11px] text-[#71717A] uppercase tracking-wider mb-1">
              Receitas
            </div>
            <div className="text-[18px] font-semibold text-[#4ADE80] font-mono">
              + {isVisible ? formatCurrency(income) : '•••••'}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#71717A] uppercase tracking-wider mb-1">
              Despesas
            </div>
            <div className="text-[18px] font-semibold text-[#F87171] font-mono">
              − {isVisible ? formatCurrency(expense) : '•••••'}
            </div>
          </div>
        </div>

        {/* Mini gráfico */}
        <div className="mt-auto">
          <MiniChart data={evolution} />
        </div>
      </div>
    </div>
  )
}

// ─── Subcomponentes ─────────────────────────────────────────────────────────

function MiniChart({ data }: { data: EvolutionItem[] }) {
  if (data.length < 2) return null

  const balances = data.map((d) => d.balance)
  const max = Math.max(...balances)
  const min = Math.min(...balances)
  const range = max - min || 1

  const width = 500
  const height = 60
  const points = balances.map((value, i) => {
    const x = (i / (balances.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  })

  return (
    <svg className="w-full" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="balanceLineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points.join(' ')}
        stroke="#A78BFA"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polygon
        points={`0,${height} ${points.join(' ')} ${width},${height}`}
        fill="url(#balanceLineGrad)"
      />
    </svg>
  )
}

function BalanceCardSkeleton() {
  return (
    <div className="col-span-12 lg:col-span-8 h-[220px] bg-[#13131A] border border-[#1F1F26] rounded-2xl p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-3 w-32 bg-[#1F1F26] rounded" />
        <div className="h-10 w-64 bg-[#1F1F26] rounded" />
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-[#1F1F26] rounded" />
            <div className="h-5 w-32 bg-[#1F1F26] rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-[#1F1F26] rounded" />
            <div className="h-5 w-32 bg-[#1F1F26] rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

function BalanceCardEmpty() {
  return (
    <div className="col-span-12 lg:col-span-8 h-[220px] bg-[#13131A] border border-[#1F1F26] rounded-2xl
                    flex items-center justify-center">
      <p className="text-[13px] text-[#71717A]">Nenhum dado disponível ainda.</p>
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