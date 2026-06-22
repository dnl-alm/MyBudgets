import type { HateoasCollection, HateoasLinks } from '@/shared/lib/hateoas'
import type { CategoryResponse } from '@/features/categories/types'

export interface BudgetResponse {
  id: number
  limitAmount: number
  realizedAmount: number   // back retorna isso — frontend calcula % e saldo
  month: number
  year: number
  category: CategoryResponse
  _links: HateoasLinks
}

/**
 * Calculados no frontend — nunca vêm do backend.
 * Separamos em um tipo auxiliar para deixar explícito o que é dado vs apresentação.
 */
export interface BudgetDerived {
  percentage: number        // (realizedAmount / limitAmount) * 100
  remainingAmount: number   // limitAmount - realizedAmount
  isExceeded: boolean       // realizedAmount > limitAmount
}

export interface CreateBudgetRequest {
  categoryId: number
  limitAmount: number
  month: number
  year: number
}

export type UpdateBudgetRequest = CreateBudgetRequest

export type BudgetCollectionResponse = HateoasCollection<BudgetResponse>