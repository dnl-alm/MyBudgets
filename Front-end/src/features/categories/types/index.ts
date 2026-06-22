import type { HateoasCollection, HateoasLinks } from '@/shared/lib/hateoas'

export type CategoryType = 'INCOME' | 'EXPENSE'

/** Reutilizado dentro de TransactionResponse e BudgetResponse */
export interface CategoryResponse {
  id: number
  name: string
  color: string
  type: CategoryType
  _links: HateoasLinks
}

export interface CreateCategoryRequest {
  name: string
  color: string
  type: CategoryType
}

export type UpdateCategoryRequest = CreateCategoryRequest

export type CategoryCollectionResponse = HateoasCollection<CategoryResponse>