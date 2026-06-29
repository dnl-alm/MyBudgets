import type { BudgetResponse } from '@/features/budgets/types'

export interface BudgetTotals {
  totalLimit: number       // soma de todos os limitAmount
  totalRealized: number    // soma de todos os realizedAmount
  totalRemaining: number   // totalLimit - totalRealized
  percentage: number       // (totalRealized / totalLimit) * 100, cap em 100
  isExceeded: boolean      // totalRealized > totalLimit
}

/**
 * Agrega todos os orçamentos em totais únicos.
 * Útil para o card "Orçamento do mês" no dashboard.
 */
export function aggregateBudgets(budgets: BudgetResponse[]): BudgetTotals {
  if (budgets.length === 0) {
    return {
      totalLimit: 0,
      totalRealized: 0,
      totalRemaining: 0,
      percentage: 0,
      isExceeded: false,
    }
  }

  const totalLimit = budgets.reduce((sum, b) => sum + b.limitAmount, 0)
  const totalRealized = budgets.reduce((sum, b) => sum + b.realizedAmount, 0)

  return {
    totalLimit,
    totalRealized,
    totalRemaining: totalLimit - totalRealized,
    percentage: totalLimit > 0
      ? Math.min((totalRealized / totalLimit) * 100, 100)
      : 0,
    isExceeded: totalRealized > totalLimit,
  }
}