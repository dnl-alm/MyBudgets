import { Pencil, Trash2 } from 'lucide-react'
import type { BudgetResponse, BudgetDerived } from '@/features/budgets/types'

interface BudgetCardProps {
  budget: BudgetResponse & BudgetDerived
  onEdit: () => void
  onDelete: () => void
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  return (
    <div className="group bg-[#13131A] border border-[#1F1F26] rounded-2xl p-5
                    hover:border-[#27272A] transition-colors">

      {/* Header com categoria + ações */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: budget.category.color }}
          />
          <span className="text-[14px] font-semibold text-[#F4F4F5] truncate">
            {budget.category.name}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton onClick={onEdit} label="Editar">
            <Pencil size={13} />
          </IconButton>
          <IconButton onClick={onDelete} label="Excluir" variant="danger">
            <Trash2 size={13} />
          </IconButton>
        </div>
      </div>

      {/* Valor utilizado */}
      <div className="mb-2">
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <span className="text-[22px] font-bold text-[#F4F4F5] tracking-tight font-mono">
            {formatCurrency(budget.realizedAmount)}
          </span>
          <span className={[
            'text-[12px] font-semibold tabular-nums',
            budget.isExceeded ? 'text-[#F87171]' : 'text-[#A78BFA]',
          ].join(' ')}>
            {budget.percentage.toFixed(0)}%
          </span>
        </div>
        <div className="text-[12px] text-[#71717A]">
          de {formatCurrency(budget.limitAmount)}
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="h-1.5 bg-[#1F1F26] rounded-full overflow-hidden mb-3">
        <div
          className={[
            'h-full rounded-full transition-all duration-500',
            budget.isExceeded
              ? 'bg-gradient-to-r from-[#F87171] to-[#EF4444]'
              : 'bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]',
          ].join(' ')}
          style={{ width: `${budget.percentage}%` }}
        />
      </div>

      {/* Restante */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#71717A]">
          {budget.isExceeded ? 'Ultrapassado em' : 'Restante'}
        </span>
        <span className={[
          'text-[12px] font-semibold font-mono tabular-nums',
          budget.isExceeded ? 'text-[#F87171]' : 'text-[#4ADE80]',
        ].join(' ')}>
          {formatCurrency(Math.abs(budget.remainingAmount))}
        </span>
      </div>
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function IconButton({
  children,
  onClick,
  label,
  variant = 'default',
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
  variant?: 'default' | 'danger'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        'w-7 h-7 rounded-md flex items-center justify-center transition-colors',
        variant === 'danger'
          ? 'text-[#71717A] hover:text-[#F87171] hover:bg-[#F87171]/10'
          : 'text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#27272A]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}