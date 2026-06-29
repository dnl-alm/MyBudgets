import { http } from '@/shared/lib/http'
import { extractCollection } from '@/shared/lib/hateoas'
import type { CategoryResponse, CategoryCollectionResponse, CreateCategoryRequest, UpdateCategoryRequest } from '@/features/categories/types'

export const categoryService = {
  /**
   * Retorna array limpo — o hook não precisa saber de _embedded.
   */
  getAll: async (): Promise<CategoryResponse[]> => {
    const response = await http.get<CategoryCollectionResponse>('/categories')
    return extractCollection(response, 'categories')
  },

  getById: (id: number): Promise<CategoryResponse> =>
    http.get<CategoryResponse>(`/categories/${id}`),

  create: (data: CreateCategoryRequest): Promise<CategoryResponse> =>
    http.post<CategoryResponse>('/categories', data),

  update: (id: number, data: UpdateCategoryRequest): Promise<CategoryResponse> =>
    http.put<CategoryResponse>(`/categories/${id}`, data),

  delete: (id: number): Promise<void> =>
    http.delete(`/categories/${id}`),
}