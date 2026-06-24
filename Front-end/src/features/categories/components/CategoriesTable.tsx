import { Pencil, Trash2 } from 'lucide-react'
import type { CategoryResponse } from '@/features/categories/types'

interface CategoriesTableProps {
  categories: CategoryResponse[]
  isLoading: boolean
  onEdit: (category: CategoryResponse) => void
  onDelete: (category: CategoryResponse) => void
}

export function CategoriesTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: CategoriesTableProps) {

  if (isLoading) return <CategoriesTableSkeleton />
  if (categories.length === 0) return <CategoriesTableEmpty />

  return (
    <div className="bg-[#13131A] border border-[#1F1F26] rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#0F0F14] border-b border-[#1F1F26]">
          <tr>
            <Th className="w-[60px]">Cor</Th>
            <Th>Nome</Th>
            <Th className="w-[140px]">Tipo</Th>
            <Th className="w-[120px] text-right pr-6">Ações</Th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr
              key={category.id}
              className={[
                'group transition-colors hover:bg-[#1A1A22]',
                index < categories.length - 1 ? 'border-b border-[#1F1F26]' : '',
              ].join(' ')}
            >
              <Td className="pl-6">
                <div
                  className="w-6 h-6 rounded-md border border-white/5"
                  style={{ backgroundColor: category.color }}
                />
              </Td>
              <Td>
                <span className="text-[14px] font-medium text-[#F4F4F5]">
                  {category.name}
                </span>
              </Td>
              <Td>
                <CategoryTypeBadge type={category.type} />
              </Td>
              <Td className="pr-6">
                <div className="flex items-center justify-end gap-1">
                  <IconButton
                    onClick={() => { onEdit(category) }}
                    label="Editar"
                  >
                    <Pencil size={14} />
                  </IconButton>
                  <IconButton
                    onClick={() => { onDelete(category) }}
                    label="Excluir"
                    variant="danger"
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Subcomponentes ─────────────────────────────────────────────────────────

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={[
      'text-left px-4 py-3',
      'text-[11px] font-medium text-[#71717A] uppercase tracking-wider',
      className,
    ].join(' ')}>
      {children}
    </th>
  )
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={['px-4 py-4', className].join(' ')}>
      {children}
    </td>
  )
}

function CategoryTypeBadge({ type }: { type: 'INCOME' | 'EXPENSE' }) {
  const isIncome = type === 'INCOME'
  return (
    <span className={[
      'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium',
      isIncome
        ? 'bg-[#4ADE80]/10 text-[#4ADE80]'
        : 'bg-[#F87171]/10 text-[#F87171]',
    ].join(' ')}>
      {isIncome ? 'Receita' : 'Despesa'}
    </span>
  )
}

interface IconButtonProps {
  children: React.ReactNode
  onClick: () => void
  label: string
  variant?: 'default' | 'danger'
}

function IconButton({ children, onClick, label, variant = 'default' }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        'w-7 h-7 rounded-md flex items-center justify-center',
        'transition-colors',
        variant === 'danger'
          ? 'text-[#71717A] hover:text-[#F87171] hover:bg-[#F87171]/10'
          : 'text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#27272A]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

// ─── Estados auxiliares ─────────────────────────────────────────────────────

function CategoriesTableSkeleton() {
  return (
    <div className="bg-[#13131A] border border-[#1F1F26] rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1F1F26] bg-[#0F0F14]">
        <div className="h-3 w-20 bg-[#1F1F26] rounded animate-pulse" />
      </div>
      {[...Array<number>(5)].map((_, i) => (
        <div
          key={i}
          className={[
            'flex items-center gap-4 px-4 py-4 animate-pulse',
            i < 4 ? 'border-b border-[#1F1F26]' : '',
          ].join(' ')}
        >
          <div className="w-6 h-6 rounded-md bg-[#1F1F26]" />
          <div className="h-3 w-32 bg-[#1F1F26] rounded flex-1" />
          <div className="h-5 w-16 bg-[#1F1F26] rounded" />
          <div className="h-7 w-16 bg-[#1F1F26] rounded" />
        </div>
      ))}
    </div>
  )
}

function CategoriesTableEmpty() {
  return (
    <div className="bg-[#13131A] border border-[#1F1F26] rounded-2xl
                    flex flex-col items-center justify-center py-16 px-6">
      <p className="text-[14px] text-[#A1A1AA] font-medium mb-1">
        Nenhuma categoria criada
      </p>
      <p className="text-[13px] text-[#71717A] text-center">
        Crie sua primeira categoria para começar a organizar suas finanças.
      </p>
    </div>
  )
}