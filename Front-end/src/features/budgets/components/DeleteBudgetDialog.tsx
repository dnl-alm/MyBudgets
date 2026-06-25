import { useState } from 'react'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { useBudgets } from '@/features/budgets/hooks/useBudgets'
import { ApiError } from '@/shared/lib/http'
import type { BudgetResponse } from '@/features/budgets/types'

interface DeleteBudgetDialogProps {
  isOpen: boolean
  onClose: () => void
  budget?: BudgetResponse
  defaultPeriod: { month: number; year: number }
}

export function DeleteBudgetDialog({
  isOpen,
  onClose,
  budget,
  defaultPeriod,
}: DeleteBudgetDialogProps) {
  const { deleteBudget, isDeleting } = useBudgets(defaultPeriod)
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleClose = () => {
    setErrorMessage(undefined)
    onClose()
  }

  const handleConfirm = () => {
    if (!budget) return

    setErrorMessage(undefined)
    deleteBudget(budget.id, {
      onSuccess: handleClose,
      onError: (error) => {
        if (error instanceof ApiError) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('Erro inesperado ao excluir o orçamento.')
        }
      },
    })
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Excluir orçamento"
      description={
        <>
          Tem certeza que deseja excluir o orçamento de{' '}
          <strong className="text-[#F4F4F5]">{budget?.category.name}</strong>?{' '}
          Esta ação não pode ser desfeita.
        </>
      }
      confirmLabel="Excluir"
      variant="danger"
      isLoading={isDeleting}
      errorMessage={errorMessage}
    />
  )
}