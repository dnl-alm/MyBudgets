import type { HateoasLinks, HateoasPage } from '@/shared/lib/hateoas'
import type { CategoryResponse } from '@/features/categories/types'

export type TransactionType = 'INCOME' | 'EXPENSE'

export interface TransactionResponse {
  id: number
  amount: number
  description: string
  date: string           // yyyy-MM-dd — formatado no frontend com date-fns
  createdAt: string      // yyyy-MM-dd'T'HH:mm:ss
  type: TransactionType
  category: CategoryResponse   // composição — não duplicamos os campos
  _links: HateoasLinks
}

export interface CreateTransactionRequest {
  amount: number
  description: string
  date: string
  type: TransactionType
  categoryId: number     // envia só o ID, não o objeto inteiro
}

export type UpdateTransactionRequest = CreateTransactionRequest

export interface TransactionFilters {
  month?: number
  year?: number
  type?: TransactionType
  categoryId?: number
}

export type TransactionPageResponse = HateoasPage<TransactionResponse>