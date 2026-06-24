import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { CategoriesTable } from '@/features/categories/components/CategoriesTable'
import { Button } from '@/shared/components/ui/Button'
import type { CategoryResponse } from '@/features/categories/types'
import { CategoryFormModal } from '@/features/categories/components/CategoryFormModal'
import { DeleteCategoryDialog } from '@/features/categories/components/DeleteCategoryDialog'

/**
 * Estado do modal/diálogo da página.
 * Discriminated union: o type 'mode' garante quais campos existem em cada caso.
 */
type ModalState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; category: CategoryResponse }
  | { mode: 'delete'; category: CategoryResponse }

export function CategoriesPage() {
  const { categories, isLoading } = useCategories()
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' })

  const closeModal = () => { setModal({ mode: 'closed' }) }

  return (
    <div className="min-h-full bg-[#09090B]">

      {/* Header */}
      <header className="px-8 py-8 border-b border-[#1F1F26]">
        <div className="max-w-[1400px] mx-auto flex items-end justify-between gap-6">
          <div>
            <h1 className="text-[24px] font-semibold text-[#F4F4F5] tracking-tight">
              Categorias
            </h1>
            <p className="text-[14px] text-[#71717A] mt-1">
              Organize suas transações e orçamentos.
            </p>
          </div>

          <Button
            leftIcon={<Plus size={16} />}
            onClick={() => { setModal({ mode: 'create' }) }}
          >
            Nova categoria
          </Button>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="px-8 py-8">
        <div className="max-w-[1400px] mx-auto">
          <CategoriesTable
            categories={categories}
            isLoading={isLoading}
            onEdit={(category) => { setModal({ mode: 'edit', category }) }}
            onDelete={(category) => { setModal({ mode: 'delete', category }) }}
          />
        </div>
      </div>

      {/* Modais — implementaremos na próxima etapa */}
      
      <CategoryFormModal
        isOpen={modal.mode === 'create' || modal.mode === 'edit'}
        category={modal.mode === 'edit' ? modal.category : undefined}
        onClose={closeModal}
      />
      
      <DeleteCategoryDialog
        isOpen={modal.mode === 'delete'}
        category={modal.mode === 'delete' ? modal.category : undefined}
        onClose={closeModal}
      />

      {/* Placeholder enquanto não tem o modal */}
      {modal.mode !== 'closed' && (
        <div className="fixed bottom-6 right-6 bg-[#7C3AED] text-white px-4 py-2 rounded-lg text-[13px]
                        shadow-lg cursor-pointer" onClick={closeModal}>
          Modal "{modal.mode}" pendente — clique para fechar
        </div>
      )}
    </div>
  )
}