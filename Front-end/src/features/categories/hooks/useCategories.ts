import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '../services/category.service'
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../types'

/**
 * Chave do cache centralizada como constante.
 * Se precisar invalidar de outro hook (ex: transactions), importa daqui.
 * Nunca escreva a string 'categories' espalhada pelo código.
 */
export const CATEGORIES_QUERY_KEY = ['categories'] as const

export function useCategories() {
  const queryClient = useQueryClient()

  // ─── Query ──────────────────────────────────────────────────────────────────

  const query = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => categoryService.getAll(),
  })

  // ─── Mutations ──────────────────────────────────────────────────────────────

  /**
   * Após qualquer escrita bem-sucedida, invalidamos o cache.
   * Isso força o useQuery a refazer a requisição e a UI atualiza automaticamente.
   */
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.create(data),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) =>
      categoryService.update(id, data),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoryService.delete(id),
    onSuccess: invalidate,
  })

  // ─── Interface pública ───────────────────────────────────────────────────────

  return {
    // dados
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // ações
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,

    // estados das mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}