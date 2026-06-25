import type { TransactionFilters, TransactionType } from '@/features/transactions/types'
import type { PaginationParams } from '@/shared/types'

/**
 * Valores padrão dos filtros e paginação.
 * Quando um parâmetro está nesse valor, é omitido da URL.
 */
export const DEFAULT_PAGINATION: Required<PaginationParams> = {
  page: 0,
  size: 20,
  sort: 'date,desc',
}

export interface TransactionsPageState {
  filters: TransactionFilters
  pagination: PaginationParams
}

/**
 * Lê o estado da URL e retorna objeto tipado com defaults aplicados.
 * Parâmetros inválidos são ignorados (fallback no default).
 */
export function readStateFromSearchParams(searchParams: URLSearchParams): TransactionsPageState {
  const filters: TransactionFilters = {}

  // Mês (1-12)
  const month = parseIntParam(searchParams.get('month'))
  if (month && month >= 1 && month <= 12) {
    filters.month = month
  }

  // Ano (2000-2100)
  const year = parseIntParam(searchParams.get('year'))
  if (year && year >= 2000 && year <= 2100) {
    filters.year = year
  }

  // Tipo
  const type = searchParams.get('type')
  if (type === 'INCOME' || type === 'EXPENSE') {
    filters.type = type
  }

  // Categoria
  const categoryId = parseIntParam(searchParams.get('categoryId'))
  if (categoryId) {
    filters.categoryId = categoryId
  }

  // Paginação
  const pagination: PaginationParams = {
    page: parseIntParam(searchParams.get('page')) ?? DEFAULT_PAGINATION.page,
    size: parseIntParam(searchParams.get('size')) ?? DEFAULT_PAGINATION.size,
    sort: searchParams.get('sort') ?? DEFAULT_PAGINATION.sort,
  }

  return { filters, pagination }
}

/**
 * Gera o objeto de query params para a URL, omitindo valores default.
 */
export function writeStateToSearchParams(state: TransactionsPageState): Record<string, string> {
  const params: Record<string, string> = {}

  // Filtros — só vão se preenchidos
  if (state.filters.month !== undefined) params.month = String(state.filters.month)
  if (state.filters.year !== undefined) params.year = String(state.filters.year)
  if (state.filters.type) params.type = state.filters.type
  if (state.filters.categoryId !== undefined) params.categoryId = String(state.filters.categoryId)

  // Paginação — só vai se diferente do default
  if (state.pagination.page !== undefined && state.pagination.page !== DEFAULT_PAGINATION.page) {
    params.page = String(state.pagination.page)
  }
  if (state.pagination.size !== undefined && state.pagination.size !== DEFAULT_PAGINATION.size) {
    params.size = String(state.pagination.size)
  }
  if (state.pagination.sort && state.pagination.sort !== DEFAULT_PAGINATION.sort) {
    params.sort = state.pagination.sort
  }

  return params
}

/**
 * Conta quantos filtros estão ativos (excluindo paginação).
 * Útil para mostrar "Limpar filtros (3)" no header.
 */
export function countActiveFilters(filters: TransactionFilters): number {
  let count = 0
  if (filters.month !== undefined) count += 1
  if (filters.year !== undefined) count += 1
  if (filters.type) count += 1
  if (filters.categoryId !== undefined) count += 1
  return count
}

// ─── Helper privado ─────────────────────────────────────────────────────────

function parseIntParam(value: string | null): number | undefined {
  if (!value) return undefined
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? undefined : parsed
}