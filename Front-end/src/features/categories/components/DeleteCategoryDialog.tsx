import { useState } from 'react'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { ApiError } from '@/shared/lib/http'
import type { CategoryResponse } from '@/features/categories/types'

interface DeleteCategoryDialogProps {
  isOpen: boolean
  onClose: () => void
  category?: CategoryResponse
}

export function DeleteCategoryDialog({ isOpen, onClose, category }: DeleteCategoryDialogProps) {
  const { deleteCategory, isDeleting } = useCategories()
  const [errorMessage, setErrorMessage] = useState<string>()

  // Limpa erro ao fechar
  const handleClose = () => {
    setErrorMessage(undefined)
    onClose()
  }

  const handleConfirm = () => {
    if (!category) return

    setErrorMessage(undefined)
    deleteCategory(category.id, {
      onSuccess: handleClose,
      onError: (error) => {
        if (error instanceof ApiError) {
            // 500 também indica provavelmente dependências (o backend não trata como 400/409 ainda)
            if (error.status === 400 || error.status === 409 || error.status === 500) {
                setErrorMessage('Não foi possível excluir. Esta categoria pode ter transações ou orçamentos vinculados.')
            } else {
                setErrorMessage(error.message)
            }  
        } else {
        setErrorMessage('Erro inesperado ao excluir a categoria.')
        }
    },
    })
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Excluir categoria"
      description={
        <>
          Tem certeza que deseja excluir a categoria{' '}
          <strong className="text-[#F4F4F5]">{category?.name}</strong>?{' '}
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