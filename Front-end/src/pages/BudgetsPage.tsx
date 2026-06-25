import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useBudgets } from '@/features/budgets/hooks/useBudgets'
import { BudgetCard } from '@/features/budgets/components/BudgetCard'
import { BudgetFormModal } from '@/features/budgets/components/BudgetFormModal'
import { DeleteBudgetDialog } from '@/features/budgets/components/DeleteBudgetDialog'
import { MonthSelector } from '@/shared/components/ui/MonthSelector'
import { Button } from '@/shared/components/ui/Button'
import {
  resolveBudgetPeriod,
  shiftPeriod,
  formatPeriod,
} from '@/features/budgets/utils/budget-period'
import type { BudgetResponse, BudgetDerived } from '@/features/budgets/types'

type ModalState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; budget: BudgetResponse & BudgetDerived }
  | { mode: 'delete'; budget: BudgetResponse & BudgetDerived }

export function BudgetsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' })

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

  const { budgets, isLoading } = useBudgets(period)
  const closeModal = () => { setModal({ mode: 'closed' }) }

  const navigatePeriod = (delta: number) => {
    const next = shiftPeriod(period, delta)
    setSearchParams({ month: String(next.month), year: String(next.year) })
  }

  return (
    <div className="min-h-full bg-[#09090B]">

      <header className="px-8 py-8 border-b border-[#1F1F26]">
        <div className="max-w-[1400px] mx-auto flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-[24px] font-semibold text-[#F4F4F5] tracking-tight">
              Orçamentos
            </h1>
            <p className="text-[14px] text-[#71717A] mt-1">
              Acompanhe seus limites de gastos por categoria.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MonthSelector
              month={period.month}
              year={period.year}
              label={formatPeriod(period)}
              onPrevious={() => { navigatePeriod(-1) }}
              onNext={() => { navigatePeriod(1) }}
            />
            <Button
              leftIcon={<Plus size={16} />}
              onClick={() => { setModal({ mode: 'create' }) }}
            >
              Novo orçamento
            </Button>
          </div>
        </div>
      </header>

      <div className="px-8 py-8">
        <div className="max-w-[1400px] mx-auto">
          {isLoading ? (
            <BudgetsGridSkeleton />
          ) : budgets.length === 0 ? (
            <BudgetsEmpty />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onEdit={() => { setModal({ mode: 'edit', budget }) }}
                  onDelete={() => { setModal({ mode: 'delete', budget }) }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      <BudgetFormModal
        isOpen={modal.mode === 'create' || modal.mode === 'edit'}
        budget={modal.mode === 'edit' ? modal.budget : undefined}
        defaultPeriod={period}
        onClose={closeModal}
      />

      <DeleteBudgetDialog
        isOpen={modal.mode === 'delete'}
        budget={modal.mode === 'delete' ? modal.budget : undefined}
        defaultPeriod={period}
        onClose={closeModal}
      />
    </div>
  )
}

function BudgetsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array<number>(6)].map((_, i) => (
        <div key={i} className="bg-[#13131A] border border-[#1F1F26] rounded-2xl p-5 animate-pulse">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1F1F26]" />
            <div className="h-3 w-24 bg-[#1F1F26] rounded" />
          </div>
          <div className="h-6 w-32 bg-[#1F1F26] rounded mb-2" />
          <div className="h-3 w-20 bg-[#1F1F26] rounded mb-3" />
          <div className="h-1.5 w-full bg-[#1F1F26] rounded-full mb-3" />
          <div className="h-3 w-24 bg-[#1F1F26] rounded" />
        </div>
      ))}
    </div>
  )
}

function BudgetsEmpty() {
  return (
    <div className="bg-[#13131A] border border-[#1F1F26] rounded-2xl
                    flex flex-col items-center justify-center py-16 px-6 text-center">
      <p className="text-[14px] text-[#A1A1AA] font-medium mb-1">
        Nenhum orçamento neste mês
      </p>
      <p className="text-[13px] text-[#71717A] max-w-[360px]">
        Crie um orçamento para acompanhar quanto você está gastando em cada categoria.
      </p>
    </div>
  )
}