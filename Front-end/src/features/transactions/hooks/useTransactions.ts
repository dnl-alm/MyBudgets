import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionService } from '../services/transaction.service'
import type { CreateTransactionRequest, UpdateTransactionRequest, TransactionFilters } from '../types'
import type { PaginationParams } from '@/shared/types'

export const TRANSACTIONS_QUERY_KEY = 'transactions' as const

export function useTransactions(
  filters?: TransactionFilters,
  pagination?: PaginationParams,
) {
  const queryClient = useQueryClient()

  /**
   * Filtros e paginação fazem parte do queryKey.
   * Cada combinação diferente tem seu próprio cache.
   */
  const queryKey = [TRANSACTIONS_QUERY_KEY, filters, pagination] as const

  const query = useQuery({
    queryKey,
    queryFn: () => transactionService.getAll(filters, pagination),
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })

  const createMutation = useMutation({
    mutationFn: (data: CreateTransactionRequest) => transactionService.create(data),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTransactionRequest }) =>
      transactionService.update(id, data),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => transactionService.delete(id),
    onSuccess: invalidate,
  })

  return {
    // dados
    transactions: query.data?.items ?? [],
    page: query.data?.page,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // ações
    createTransaction: createMutation.mutate,
    updateTransaction: updateMutation.mutate,
    deleteTransaction: deleteMutation.mutate,

    // estados
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}