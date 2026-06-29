import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useCategories } from '@/features/categories/hooks/useCategories'
import type { CategoryResponse, CategoryType } from '@/features/categories/types'

interface CategorySelectProps {
  label: string
  value: number | undefined
  onChange: (categoryId: number) => void
  /** Filtra apenas categorias deste tipo. Se undefined, mostra todas. */
  filterByType?: CategoryType
  error?: string
  placeholder?: string
}

/**
 * Select customizado de categoria — mostra bolinha colorida ao lado do nome.
 *
 * Padrão de combobox acessível: clica para abrir, clica fora para fechar,
 * ESC fecha, setas navegam (futura melhoria).
 */
export function CategorySelect({
  label,
  value,
  onChange,
  filterByType,
  error,
  placeholder = 'Selecione uma categoria',
}: CategorySelectProps) {
  const { categories, isLoading } = useCategories()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = filterByType
    ? categories.filter((c) => c.type === filterByType)
    : categories

  const selected = categories.find((c) => c.id === value)

  // Fecha ao clicar fora
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => { document.removeEventListener('mousedown', handleClickOutside) }
  }, [isOpen])

  // Fecha com ESC
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', handleEsc)
    return () => { document.removeEventListener('keydown', handleEsc) }
  }, [isOpen])

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label className="text-[13px] font-medium text-[#D4D4D8]">
        {label}
      </label>

      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => { setIsOpen((v) => !v) }}
          disabled={isLoading}
          className={[
            'w-full bg-[#16161D] text-[14px] text-left px-3.5 py-2.5 rounded-lg',
            'border transition-all duration-150 outline-none',
            'hover:border-[#3F3F46]',
            'focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12)]',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'flex items-center justify-between gap-2',
            error ? 'border-[#F87171]/40' : 'border-[#27272A]',
          ].join(' ')}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selected ? (
            <span className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: selected.color }}
              />
              <span className="text-[#F4F4F5] truncate">{selected.name}</span>
            </span>
          ) : (
            <span className="text-[#52525B]">{placeholder}</span>
          )}
          <ChevronDown
            size={16}
            className={[
              'text-[#71717A] shrink-0 transition-transform',
              isOpen ? 'rotate-180' : '',
            ].join(' ')}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            role="listbox"
            className="absolute top-full left-0 right-0 mt-1 z-10
                       bg-[#0F0F14] border border-[#27272A] rounded-lg
                       shadow-[0_8px_24px_rgba(0,0,0,0.4)]
                       max-h-[240px] overflow-y-auto p-1"
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-2.5 text-[13px] text-[#71717A] text-center">
                Nenhuma categoria disponível
              </div>
            ) : (
              filtered.map((category) => {
                const isSelected = category.id === value
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      onChange(category.id)
                      setIsOpen(false)
                    }}
                    role="option"
                    aria-selected={isSelected}
                    className={[
                      'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md',
                      'text-[13px] text-left transition-colors',
                      isSelected
                        ? 'bg-[#7C3AED]/15 text-[#F4F4F5]'
                        : 'text-[#D4D4D8] hover:bg-[#1F1F26]',
                    ].join(' ')}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="flex-1 truncate">{category.name}</span>
                    <CategoryTypeBadge type={category.type} />
                    {isSelected && <Check size={14} className="text-[#A78BFA] shrink-0" />}
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[12px] text-[#F87171]" role="alert">{error}</p>
      )}
    </div>
  )
}

function CategoryTypeBadge({ type }: { type: CategoryType }) {
  const isIncome = type === 'INCOME'
  return (
    <span className={[
      'text-[10px] font-medium px-1.5 py-0.5 rounded',
      isIncome
        ? 'bg-[#4ADE80]/10 text-[#4ADE80]'
        : 'bg-[#F87171]/10 text-[#F87171]',
    ].join(' ')}>
      {isIncome ? 'Receita' : 'Despesa'}
    </span>
  )
}