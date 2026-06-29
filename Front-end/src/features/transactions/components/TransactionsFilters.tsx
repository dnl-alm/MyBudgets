import { X } from 'lucide-react'
import { MonthSelector } from '@/shared/components/ui/MonthSelector'
import { CategorySelect } from '@/features/categories/components/CategorySelect'
import { formatPeriod, shiftPeriod } from '@/features/budgets/utils/budget-period'
import type { TransactionFilters, TransactionType } from '@/features/transactions/types'

interface TransactionsFiltersProps {
  filters: TransactionFilters
  onChange: (filters: TransactionFilters) => void
  activeCount: number
}

export function TransactionsFiltersBar({
  filters,
  onChange,
  activeCount,
}: TransactionsFiltersProps) {

  const hasPeriodFilter = filters.month !== undefined && filters.year !== undefined
  const periodLabel = hasPeriodFilter
    ? formatPeriod({ month: filters.month!, year: filters.year! })
    : 'Todos os períodos'

  const handlePeriodPrevious = () => {
    if (filters.month === undefined || filters.year === undefined) {
      const now = new Date()
      onChange({ ...filters, month: now.getMonth() + 1, year: now.getFullYear() })
      return
    }
    const next = shiftPeriod({ month: filters.month, year: filters.year }, -1)
    onChange({ ...filters, month: next.month, year: next.year })
  }

  const handlePeriodNext = () => {
    if (filters.month === undefined || filters.year === undefined) {
      const now = new Date()
      onChange({ ...filters, month: now.getMonth() + 1, year: now.getFullYear() })
      return
    }
    const next = shiftPeriod({ month: filters.month, year: filters.year }, 1)
    onChange({ ...filters, month: next.month, year: next.year })
  }

  const clearPeriod = () => {
    const { month, year, ...rest } = filters
    void month
    void year
    onChange(rest)
  }

  const handleTypeChange = (type: TransactionType | undefined) => {
    if (type === undefined) {
      const { type: _, ...rest } = filters
      void _
      onChange(rest)
    } else {
      onChange({ ...filters, type })
    }
  }

  const handleCategoryChange = (categoryId: number) => {
    onChange({ ...filters, categoryId })
  }

  const clearCategory = () => {
    const { categoryId, ...rest } = filters
    void categoryId
    onChange(rest)
  }

  const clearAll = () => {
    onChange({})
  }

  return (
    <div className="bg-[#13131A] border border-[#1F1F26] rounded-2xl p-4 mb-5">
      <div className="flex items-center gap-3 flex-wrap">

        {/* Período */}
        <div className="flex items-center gap-2">
          <MonthSelector
            month={filters.month ?? new Date().getMonth() + 1}
            year={filters.year ?? new Date().getFullYear()}
            label={periodLabel}
            onPrevious={handlePeriodPrevious}
            onNext={handlePeriodNext}
          />
          {hasPeriodFilter && (
            <ClearButton onClick={clearPeriod} ariaLabel="Remover filtro de período" />
          )}
        </div>

        {/* Tipo */}
        <div className="flex items-center bg-[#0F0F14] border border-[#1F1F26] rounded-lg p-0.5">
          <TypeButton
            active={filters.type === undefined}
            onClick={() => { handleTypeChange(undefined) }}
          >
            Todas
          </TypeButton>
          <TypeButton
            active={filters.type === 'INCOME'}
            onClick={() => { handleTypeChange('INCOME') }}
            color="#4ADE80"
          >
            Receitas
          </TypeButton>
          <TypeButton
            active={filters.type === 'EXPENSE'}
            onClick={() => { handleTypeChange('EXPENSE') }}
            color="#F87171"
          >
            Despesas
          </TypeButton>
        </div>

        {/* Categoria */}
        <div className="flex items-center gap-2 min-w-[220px]">
          <div className="flex-1">
            <CategoryFilterSelect
              value={filters.categoryId}
              onChange={handleCategoryChange}
              filterByType={filters.type}
            />
          </div>
          {filters.categoryId !== undefined && (
            <ClearButton onClick={clearCategory} ariaLabel="Remover filtro de categoria" />
          )}
        </div>

        {/* Limpar todos */}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="ml-auto text-[12px] text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors
                       flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[#1F1F26]"
          >
            Limpar filtros
            <span className="text-[10px] bg-[#27272A] px-1.5 py-0.5 rounded-md font-medium">
              {activeCount}
            </span>
          </button>
        )}

      </div>
    </div>
  )
}

// ─── Subcomponentes ─────────────────────────────────────────────────────────

function TypeButton({
  children,
  active,
  onClick,
  color,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  color?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-150',
        active
          ? 'bg-[#7C3AED] text-white'
          : 'text-[#71717A] hover:text-[#D4D4D8]',
      ].join(' ')}
    >
      {color && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: active ? '#FFFFFF' : color }}
        />
      )}
      {children}
    </button>
  )
}

function ClearButton({ onClick, ariaLabel }: { onClick: () => void; ariaLabel: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="w-7 h-7 rounded-md flex items-center justify-center
                 text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#1F1F26] transition-colors"
    >
      <X size={14} />
    </button>
  )
}

/**
 * Variação compacta do CategorySelect para usar como filtro.
 * Diferenças: sem label visível, placeholder padrão de filtro.
 */
function CategoryFilterSelect({
  value,
  onChange,
  filterByType,
}: {
  value: number | undefined
  onChange: (id: number) => void
  filterByType?: TransactionType
}) {
  return (
    <CategorySelect
      label=""
      value={value}
      onChange={onChange}
      filterByType={filterByType}
      placeholder="Todas as categorias"
    />
  )
}