export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
}

export interface PaginationState {
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
}