/**
 * Tipos compartilhados entre features.
 */

/** Parâmetros de paginação enviados ao backend */
export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
}

/** Estado de paginação para uso nos componentes */
export interface PaginationState {
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
}