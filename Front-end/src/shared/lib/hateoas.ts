// ─── Links ────────────────────────────────────────────────────────────────────

export interface HateoasLink {
  href: string
}

export interface HateoasLinks {
  self: HateoasLink
  [key: string]: HateoasLink
}

// ─── Lista simples (sem paginação) ────────────────────────────────────────────
// Usada em: categorias, orçamentos

export interface HateoasCollection<T> {
  _embedded: Record<string, T[]>
  _links: HateoasLinks
}

// ─── Lista paginada ───────────────────────────────────────────────────────────
// Usada em: transações

export interface HateoasPage<T> {
  _embedded: Record<string, T[]>
  _links: HateoasLinks
  page: PageInfo
}

export interface PageInfo {
  size: number
  totalElements: number
  totalPages: number
  number: number        // base 0
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extrai itens de uma lista simples.
 * 
 * @example
 * const categories = extractCollection(response, 'categories')
 */
export function extractCollection<T>(
  response: HateoasCollection<T>,
  key: string,
): T[] {
  return response._embedded?.[key] ?? []
}

/**
 * Extrai itens e metadados de paginação de uma lista paginada.
 *
 * @example
 * const { items, page } = extractPage(response, 'transactions')
 */
export function extractPage<T>(
  response: HateoasPage<T>,
  key: string,
): { items: T[]; page: PageInfo } {
  return {
    items: response._embedded?.[key] ?? [],
    page: response.page,
  }
}

export function hasNextPage(response: HateoasPage<unknown>): boolean {
  return 'next' in response._links
}

export function hasPrevPage(response: HateoasPage<unknown>): boolean {
  return 'prev' in response._links
}