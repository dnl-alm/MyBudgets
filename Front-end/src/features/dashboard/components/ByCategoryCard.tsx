import { useState } from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import type { ByCategoryResponse } from '@/features/reports/types'
import type { TransactionType } from '@/features/transactions/types'

interface ByCategoryCardProps {
  month: number
  year: number
  data: ByCategoryResponse | undefined
  isLoading: boolean
  selectedType: TransactionType
  onTypeChange: (type: TransactionType) => void
}

/**
 * Card "Despesas por categoria" — toggle EXPENSE/INCOME + pizza + lista.
 *
 * O componente é controlado: quem decide o type é o pai (DashboardPage),
 * porque o type precisa ser passado para o hook useByCategory.
 * Mantém a separação Page (orquestra) <-> Component (renderiza).
 */
export function ByCategoryCard({
  data,
  isLoading,
  selectedType,
  onTypeChange,
}: ByCategoryCardProps) {

  return (
    <div className="col-span-12 lg:col-span-7 bg-[#13131A] border border-[#1F1F26] rounded-2xl p-6">
      <div className="flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[12px] font-medium text-[#A1A1AA] uppercase tracking-wider">
            Por categoria
          </span>

          {/* Toggle EXPENSE/INCOME */}
          <div className="flex items-center bg-[#0F0F14] border border-[#1F1F26] rounded-lg p-0.5">
            <ToggleButton
              active={selectedType === 'EXPENSE'}
              onClick={() => onTypeChange('EXPENSE')}
            >
              Despesas
            </ToggleButton>
            <ToggleButton
              active={selectedType === 'INCOME'}
              onClick={() => onTypeChange('INCOME')}
            >
              Receitas
            </ToggleButton>
          </div>
        </div>

        {/* Conteúdo */}
        {isLoading ? (
          <ByCategorySkeleton />
        ) : !data || data.items.length === 0 ? (
          <ByCategoryEmpty type={selectedType} />
        ) : (
          <ByCategoryContent data={data} />
        )}
      </div>
    </div>
  )
}

// ─── Conteúdo principal ─────────────────────────────────────────────────────

function ByCategoryContent({ data }: { data: ByCategoryResponse }) {
  const chartData = data.items.map((item) => ({
    name: item.categoryName,
    value: item.amount,
    color: item.color,
  }))

  return (
    <div className="flex items-center gap-6 flex-1">

      {/* Pizza com total no centro */}
      <div className="relative w-[180px] h-[180px] shrink-0">
        <PieChart width={180} height={180}>
          <Pie
            data={chartData}
            innerRadius={60}
            outerRadius={85}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            paddingAngle={2}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>

        {/* Total no centro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[18px] font-bold text-[#F4F4F5] tracking-tight font-mono">
            {formatCurrencyCompact(data.total)}
          </div>
          <div className="text-[10px] text-[#71717A] uppercase tracking-wider">
            Total
          </div>
        </div>
      </div>

      {/* Lista de categorias */}
      <div className="flex-1 min-w-0 space-y-3 overflow-y-auto max-h-[240px]">
        {data.items.map((item) => (
          <CategoryRow key={item.categoryId} item={item} />
        ))}
      </div>
    </div>
  )
}

interface CategoryRowItemProps {
  item: ByCategoryResponse['items'][number]
}

function CategoryRow({ item }: CategoryRowItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: item.color }}
      />
      <span className="text-[13px] text-[#E4E4E7] flex-1 truncate">
        {item.categoryName}
      </span>
      <span className="text-[11px] text-[#71717A] tabular-nums w-[44px] text-right">
        {item.percentage.toFixed(0)}%
      </span>
      <span className="text-[13px] text-[#F4F4F5] font-medium font-mono tabular-nums w-[100px] text-right">
        {formatCurrency(item.amount)}
      </span>
    </div>
  )
}

// ─── Toggle ─────────────────────────────────────────────────────────────────

interface ToggleButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function ToggleButton({ active, onClick, children }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-150',
        active
          ? 'bg-[#7C3AED] text-white'
          : 'text-[#71717A] hover:text-[#D4D4D8]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

// ─── Estados auxiliares ─────────────────────────────────────────────────────

function ByCategorySkeleton() {
  return (
    <div className="flex items-center gap-6 flex-1 animate-pulse">
      <div className="w-[180px] h-[180px] rounded-full bg-[#1F1F26] shrink-0" />
      <div className="flex-1 space-y-3">
        {[...Array<number>(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#1F1F26]" />
            <div className="h-3 flex-1 bg-[#1F1F26] rounded" />
            <div className="h-3 w-20 bg-[#1F1F26] rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ByCategoryEmpty({ type }: { type: TransactionType }) {
  const label = type === 'EXPENSE' ? 'despesa' : 'receita'
  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-[13px] text-[#71717A] text-center">
        Nenhuma {label} registrada<br />neste mês.
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

/**
 * Formato compacto para valores grandes — útil quando o espaço é limitado.
 * 1500 → R$ 1,5k    1500000 → R$ 1,5M
 */
function formatCurrencyCompact(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}