// Relatórios não têm HATEOAS — respostas simples

export interface SummaryResponse {
  totalIncome: number
  totalExpense: number
  balance: number          // pode ser negativo
  month: number
  year: number
}

export interface CategorySummaryItem {
  categoryId: number
  categoryName: string
  color: string
  amount: number
  percentage: number       // calculado no backend, soma 100
}

export interface ByCategoryResponse {
  type: 'INCOME' | 'EXPENSE'
  total: number
  items: CategorySummaryItem[]
}

export interface EvolutionItem {
  month: number
  year: number
  totalIncome: number
  totalExpense: number
  balance: number          // pode ser negativo
}

export interface EvolutionResponse {
  items: EvolutionItem[]
}

export interface EvolutionParams {
  startMonth: number
  startYear: number
  endMonth: number
  endYear: number
}