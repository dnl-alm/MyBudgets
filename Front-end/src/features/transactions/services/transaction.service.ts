import { http } from '@/shared/lib/http'
import { extractPage } from '@/shared/lib/hateoas'
import type {
  TransactionResponse,
  TransactionPageResponse,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilters,
} from '@/features/transactions/types'
import type { PaginationParams } from '@/shared/types'
import type { PageInfo } from '@/shared/lib/hateoas'

export interface TransactionPage {
  items: TransactionResponse[]
  page: PageInfo
}

export const transactionService = {
  getAll: async (
    filters?: TransactionFilters,
    pagination?: PaginationParams,
  ): Promise<TransactionPage> => {
    const response = await http.get<TransactionPageResponse>('/transactions', {
      ...filters,
      ...pagination,
    })
    return extractPage(response, 'transactions')
  },

  getById: (id: number): Promise<TransactionResponse> =>
    http.get<TransactionResponse>(`/transactions/${id}`),

  create: (data: CreateTransactionRequest): Promise<TransactionResponse> =>
    http.post<TransactionResponse>('/transactions', data),

  update: (id: number, data: UpdateTransactionRequest): Promise<TransactionResponse> =>
    http.put<TransactionResponse>(`/transactions/${id}`, data),

  delete: (id: number): Promise<void> =>
    http.delete(`/transactions/${id}`),
}