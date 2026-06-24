import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetService } from '../services/budget.service'
import type { BudgetPeriod } from '../services/budget.service'
import type { CreateBudgetRequest, UpdateBudgetRequest, BudgetResponse, BudgetDerived } from '../types'

export const BUDGETS_QUERY_KEY = 'budgets' as const

/**
 * Calcula os campos derivados de um orçamento.
 * Separado em função pura para ser testável e reutilizável.
 */
export function deriveBudget(budget: BudgetResponse): BudgetResponse & BudgetDerived {
  const percentage = budget.limitAmount > 0
    ? (budget.realizedAmount / budget.limitAmount) * 100
    : 0

  return {
    ...budget,
    percentage: Math.min(percentage, 100),
    remainingAmount: budget.limitAmount - budget.realizedAmount,
    isExceeded: budget.realizedAmount > budget.limitAmount,
  }
}

export function useBudgets(period: BudgetPeriod) {
  const queryClient = useQueryClient()

  const queryKey = [BUDGETS_QUERY_KEY, period] as const

  const query = useQuery({
    queryKey,
    queryFn: () => budgetService.getAll(period),
    select: (data) => data.map(deriveBudget),
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [BUDGETS_QUERY_KEY] })

  const createMutation = useMutation({
    mutationFn: (data: CreateBudgetRequest) => budgetService.create(data),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBudgetRequest }) =>
      budgetService.update(id, data),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => budgetService.delete(id),
    onSuccess: invalidate,
  })

  return {
    budgets: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    createBudget: createMutation.mutate,
    updateBudget: updateMutation.mutate,
    deleteBudget: deleteMutation.mutate,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}