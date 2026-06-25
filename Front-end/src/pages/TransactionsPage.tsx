import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'
import { TransactionsTable } from '@/features/transactions/components/TransactionsTable'
import { TransactionsPagination } from '@/features/transactions/components/TransactionsPagination'
import { TransactionsFiltersBar } from '@/features/transactions/components/TransactionsFilters'
import { TransactionFormModal } from '@/features/transactions/components/TransactionFormModal'
import { DeleteTransactionDialog } from '@/features/transactions/components/DeleteTransactionDialog'
import { Button } from '@/shared/components/ui/Button'
import {
  readStateFromSearchParams,
  writeStateToSearchParams,
  countActiveFilters,
} from '@/features/transactions/utils/transaction-filters'
import type { TransactionFilters, TransactionResponse } from '@/features/transactions/types'

type ModalState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; transaction: TransactionResponse }
  | { mode: 'delete'; transaction: TransactionResponse }

export function TransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' })

  const { filters, pagination } = readStateFromSearchParams(searchParams)
  const { transactions, page, isLoading } = useTransactions(filters, pagination)
  const activeFiltersCount = countActiveFilters(filters)

  const closeModal = () => { setModal({ mode: 'closed' }) }

  const handleFiltersChange = (newFilters: TransactionFilters) => {
    // Resetar página ao mudar filtros — caso contrário pode ficar em página vazia
    setSearchParams(writeStateToSearchParams({
      filters: newFilters,
      pagination: { ...pagination, page: 0 },
    }))
  }

  const handlePageChange = (newPage: number) => {
    setSearchParams(writeStateToSearchParams({
      filters,
      pagination: { ...pagination, page: newPage },
    }))
  }

  return (
    <div className="min-h-full bg-[#09090B]">

      {/* Header */}
      <header className="px-8 py-8 border-b border-[#1F1F26]">
        <div className="max-w-[1400px] mx-auto flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-[24px] font-semibold text-[#F4F4F5] tracking-tight">
              Transações
            </h1>
            <p className="text-[14px] text-[#71717A] mt-1">
              Todas as entradas e saídas do seu dinheiro.
            </p>
          </div>

          <Button
            leftIcon={<Plus size={16} />}
            onClick={() => { setModal({ mode: 'create' }) }}
          >
            Nova transação
          </Button>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="px-8 py-8">
        <div className="max-w-[1400px] mx-auto">

          <TransactionsFiltersBar
            filters={filters}
            onChange={handleFiltersChange}
            activeCount={activeFiltersCount}
          />

          <TransactionsTable
            transactions={transactions}
            isLoading={isLoading}
            onEdit={(transaction) => { setModal({ mode: 'edit', transaction }) }}
            onDelete={(transaction) => { setModal({ mode: 'delete', transaction }) }}
          />

          {page && (
            <TransactionsPagination
              page={page}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Modais */}
      <TransactionFormModal
        isOpen={modal.mode === 'create' || modal.mode === 'edit'}
        transaction={modal.mode === 'edit' ? modal.transaction : undefined}
        onClose={closeModal}
      />

      <DeleteTransactionDialog
        isOpen={modal.mode === 'delete'}
        transaction={modal.mode === 'delete' ? modal.transaction : undefined}
        onClose={closeModal}
      />
    </div>
  )
}