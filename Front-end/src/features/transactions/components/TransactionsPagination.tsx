import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PageInfo } from '@/shared/lib/hateoas'

interface TransactionsPaginationProps {
  page: PageInfo
  onPageChange: (page: number) => void
}

/**
 * Paginação numérica com janela de páginas.
 * Mostra: ← 1 ... 4 5 6 ... 10 →
 */
export function TransactionsPagination({ page, onPageChange }: TransactionsPaginationProps) {
  if (page.totalPages <= 1) return null

  const currentPage = page.number
  const totalPages = page.totalPages
  const pages = getVisiblePages(currentPage, totalPages)

  return (
    <div className="flex items-center justify-between mt-6">
      {/* Info de total */}
      <p className="text-[12px] text-[#71717A]">
        {page.totalElements} {page.totalElements === 1 ? 'transação' : 'transações'} no total
      </p>

      {/* Controles */}
      <div className="flex items-center gap-1">
        <NavButton
          onClick={() => { onPageChange(currentPage - 1) }}
          disabled={currentPage === 0}
          ariaLabel="Página anterior"
        >
          <ChevronLeft size={14} />
        </NavButton>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`gap-${i}`} className="text-[12px] text-[#52525B] px-2">
              ...
            </span>
          ) : (
            <PageButton
              key={p}
              isActive={p === currentPage}
              onClick={() => { onPageChange(p) }}
            >
              {p + 1}
            </PageButton>
          ),
        )}

        <NavButton
          onClick={() => { onPageChange(currentPage + 1) }}
          disabled={currentPage >= totalPages - 1}
          ariaLabel="Próxima página"
        >
          <ChevronRight size={14} />
        </NavButton>
      </div>
    </div>
  )
}

// ─── Botões ─────────────────────────────────────────────────────────────────

function PageButton({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'min-w-[32px] h-8 px-2 rounded-md text-[12px] font-medium transition-colors',
        isActive
          ? 'bg-[#7C3AED] text-white'
          : 'text-[#71717A] hover:bg-[#1F1F26] hover:text-[#F4F4F5]',
      ].join(' ')}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </button>
  )
}

function NavButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled: boolean
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="w-8 h-8 rounded-md flex items-center justify-center
                 text-[#71717A] hover:bg-[#1F1F26] hover:text-[#F4F4F5]
                 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
                 transition-colors"
    >
      {children}
    </button>
  )
}

// ─── Algoritmo de janela ────────────────────────────────────────────────────

/**
 * Decide quais páginas mostrar baseado na página atual e total.
 *
 * Casos:
 *  - Até 7 páginas: mostra todas
 *  - Mais que 7: mostra primeira, última, vizinhas da atual, e "..." nos gaps
 *
 * Exemplos (currentPage base-0):
 *  total=5, current=2  →  [0,1,2,3,4]
 *  total=10, current=0 →  [0,1,2, '...', 9]
 *  total=10, current=5 →  [0, '...', 4,5,6, '...', 9]
 *  total=10, current=9 →  [0, '...', 7,8,9]
 */
function getVisiblePages(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i)
  }

  const result: (number | '...')[] = []
  const showLeftEllipsis = current > 3
  const showRightEllipsis = current < total - 4

  // Primeira página sempre
  result.push(0)

  // Gap esquerdo
  if (showLeftEllipsis) result.push('...')

  // Janela ao redor da atual
  const start = Math.max(1, current - 1)
  const end = Math.min(total - 2, current + 1)

  for (let i = start; i <= end; i++) {
    if (i !== 0 && i !== total - 1) result.push(i)
  }

  // Gap direito
  if (showRightEllipsis) result.push('...')

  // Última página sempre
  result.push(total - 1)

  return result
}