import { useState } from 'react'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'
import { ApiError } from '@/shared/lib/http'
import type { TransactionResponse } from '@/features/transactions/types'

interface DeleteTransactionDialogProps {
  isOpen: boolean
  onClose: () => void
  transaction?: TransactionResponse
}

export function DeleteTransactionDialog({
  isOpen,
  onClose,
  transaction,
}: DeleteTransactionDialogProps) {
  const { deleteTransaction, isDeleting } = useTransactions()
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleClose = () => {
    setErrorMessage(undefined)
    onClose()
  }

  const handleConfirm = () => {
    if (!transaction) return

    setErrorMessage(undefined)
    deleteTransaction(transaction.id, {
      onSuccess: handleClose,
      onError: (error) => {
        if (error instanceof ApiError) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('Erro inesperado ao excluir a transação.')
        }
      },
    })
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Excluir transação"
      description={
        <>
          Tem certeza que deseja excluir a transação{' '}
          <strong className="text-[#F4F4F5]">{transaction?.description}</strong>?{' '}
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