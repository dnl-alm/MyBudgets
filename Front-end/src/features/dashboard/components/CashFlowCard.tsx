import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { EvolutionItem } from '@/features/reports/types'

interface CashFlowCardProps {
  evolution: EvolutionItem[]
  isLoading: boolean
}

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function CashFlowCard({ evolution, isLoading }: CashFlowCardProps) {
  return (
    <div className="col-span-12 bg-[#13131A] border border-[#1F1F26] rounded-2xl p-6">
      <div className="flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] font-medium text-[#A1A1AA] uppercase tracking-wider">
            Fluxo de caixa
          </span>

          {/* Legend manual */}
          <div className="flex items-center gap-4">
            <LegendItem color="#4ADE80" label="Receitas" />
            <LegendItem color="#F87171" label="Despesas" />
          </div>
        </div>

        {/* Gráfico */}
        {isLoading ? (
          <CashFlowSkeleton />
        ) : evolution.length === 0 ? (
          <CashFlowEmpty />
        ) : (
          <CashFlowChart evolution={evolution} />
        )}
      </div>
    </div>
  )
}

// ─── Gráfico ────────────────────────────────────────────────────────────────

function CashFlowChart({ evolution }: { evolution: EvolutionItem[] }) {
  const chartData = evolution.map((item) => ({
    name: MONTH_LABELS[item.month - 1],
    Receitas: item.totalIncome,
    Despesas: item.totalExpense,
  }))

  return (
    <div className="h-[220px] -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F1F26" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#52525B"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#52525B"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatCurrencyAxis(v)}
            width={50}
          />
          <Tooltip
            cursor={{ fill: '#1F1F26', opacity: 0.5 }}
            contentStyle={{
              backgroundColor: '#0F0F14',
              border: '1px solid #27272A',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#A1A1AA', marginBottom: '4px' }}
            formatter={(value) => formatCurrency(Number(value))}
          />
          <Bar dataKey="Receitas" fill="#4ADE80" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Despesas" fill="#F87171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Legend ─────────────────────────────────────────────────────────────────

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[11px] text-[#A1A1AA] font-medium">{label}</span>
    </div>
  )
}

// ─── Estados auxiliares ─────────────────────────────────────────────────────

function CashFlowSkeleton() {
  return (
    <div className="h-[220px] flex items-end gap-3 px-2 animate-pulse">
      {[...Array<number>(12)].map((_, i) => (
        <div key={i} className="flex-1 flex gap-1 items-end">
          <div
            className="flex-1 bg-[#1F1F26] rounded-t"
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
          <div
            className="flex-1 bg-[#1F1F26] rounded-t"
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
        </div>
      ))}
    </div>
  )
}

function CashFlowEmpty() {
  return (
    <div className="h-[220px] flex items-center justify-center">
      <p className="text-[13px] text-[#71717A]">
        Nenhum dado para exibir.
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

function formatCurrencyAxis(value: number): string {
  // Compacto para o eixo: R$ 5k, R$ 10k...
  if (value === 0) return 'R$ 0'
  if (Math.abs(value) >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`
  return `R$ ${value}`
}