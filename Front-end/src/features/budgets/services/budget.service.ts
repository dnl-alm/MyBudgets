import { http } from '@/shared/lib/http'
import { extractCollection } from '@/shared/lib/hateoas'
import type {
  BudgetResponse,
  BudgetCollectionResponse,
  CreateBudgetRequest,
  UpdateBudgetRequest,
} from '@/features/budgets/types'

export interface BudgetPeriod {
  month: number
  year: number
}

export const budgetService = {
  /**
   * month e year são obrigatórios — regra de negócio do backend.
   * Tipamos como BudgetPeriod para tornar isso explícito.
   */
  getAll: async (period: BudgetPeriod): Promise<BudgetResponse[]> => {
    const response = await http.get<BudgetCollectionResponse>('/budgets', period)
    return extractCollection(response, 'budgets')
  },

  getById: (id: number): Promise<BudgetResponse> =>
    http.get<BudgetResponse>(`/budgets/${id}`),

  create: (data: CreateBudgetRequest): Promise<BudgetResponse> =>
    http.post<BudgetResponse>('/budgets', data),

  update: (id: number, data: UpdateBudgetRequest): Promise<BudgetResponse> =>
    http.put<BudgetResponse>(`/budgets/${id}`, data),

  delete: (id: number): Promise<void> =>
    http.delete(`/budgets/${id}`),
}