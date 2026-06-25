import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { TransactionResponse } from '@/features/transactions/types'

interface TransactionsTableProps {
  transactions: TransactionResponse[]
  isLoading: boolean
  onEdit: (transaction: TransactionResponse) => void
  onDelete: (transaction: TransactionResponse) => void
}

export function TransactionsTable({
  transactions,
  isLoading,
  onEdit,
  onDelete,
}: TransactionsTableProps) {

  if (isLoading) return <TransactionsTableSkeleton />
  if (transactions.length === 0) return <TransactionsTableEmpty />

  return (
    <div className="bg-[#13131A] border border-[#1F1F26] rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#0F0F14] border-b border-[#1F1F26]">
          <tr>
            <Th className="w-[120px] pl-6">Data</Th>
            <Th>Descrição</Th>
            <Th className="w-[180px]">Categoria</Th>
            <Th className="w-[140px] text-right">Valor</Th>
            <Th className="w-[100px] text-right pr-6">Ações</Th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr
              key={tx.id}
              className={[
                'group transition-colors hover:bg-[#1A1A22]',
                index < transactions.length - 1 ? 'border-b border-[#1F1F26]' : '',
              ].join(' ')}
            >
              <Td className="pl-6">
                <span className="text-[13px] text-[#A1A1AA] tabular-nums">
                  {formatDate(tx.date)}
                </span>
              </Td>

              <Td>
                <div className="flex items-center gap-3">
                  <TypeIcon type={tx.type} color={tx.category.color} />
                  <span className="text-[14px] font-medium text-[#F4F4F5] truncate">
                    {tx.description}
                  </span>
                </div>
              </Td>

              <Td>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: tx.category.color }}
                  />
                  <span className="text-[13px] text-[#A1A1AA] truncate">
                    {tx.category.name}
                  </span>
                </div>
              </Td>

              <Td className="text-right">
                <span className={[
                  'text-[14px] font-semibold font-mono tabular-nums',
                  tx.type === 'INCOME' ? 'text-[#4ADE80]' : 'text-[#F87171]',
                ].join(' ')}>
                  {tx.type === 'INCOME' ? '+' : '−'} {formatCurrency(tx.amount)}
                </span>
              </Td>

              <Td className="pr-6">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconButton onClick={() => { onEdit(tx) }} label="Editar">
                    <Pencil size={13} />
                  </IconButton>
                  <IconButton onClick={() => { onDelete(tx) }} label="Excluir" variant="danger">
                    <Trash2 size={13} />
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
    <td className={['px-4 py-3.5', className].join(' ')}>
      {children}
    </td>
  )
}

function TypeIcon({ type, color }: { type: 'INCOME' | 'EXPENSE'; color: string }) {
  const isIncome = type === 'INCOME'
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {isIncome ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
    </div>
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
        'w-7 h-7 rounded-md flex items-center justify-center transition-colors',
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

function TransactionsTableSkeleton() {
  return (
    <div className="bg-[#13131A] border border-[#1F1F26] rounded-2xl overflow-hidden">
      <div className="px-6 py-3 border-b border-[#1F1F26] bg-[#0F0F14]">
        <div className="h-3 w-20 bg-[#1F1F26] rounded animate-pulse" />
      </div>
      {[...Array<number>(6)].map((_, i) => (
        <div
          key={i}
          className={[
            'flex items-center gap-4 px-6 py-3.5 animate-pulse',
            i < 5 ? 'border-b border-[#1F1F26]' : '',
          ].join(' ')}
        >
          <div className="h-3 w-20 bg-[#1F1F26] rounded" />
          <div className="w-8 h-8 rounded-full bg-[#1F1F26]" />
          <div className="h-3 flex-1 bg-[#1F1F26] rounded" />
          <div className="h-3 w-24 bg-[#1F1F26] rounded" />
          <div className="h-3 w-20 bg-[#1F1F26] rounded" />
        </div>
      ))}
    </div>
  )
}

function TransactionsTableEmpty() {
  return (
    <div className="bg-[#13131A] border border-[#1F1F26] rounded-2xl
                    flex flex-col items-center justify-center py-16 px-6 text-center">
      <p className="text-[14px] text-[#A1A1AA] font-medium mb-1">
        Nenhuma transação encontrada
      </p>
      <p className="text-[13px] text-[#71717A] max-w-[360px]">
        Não há transações com os filtros aplicados ou ainda não foi criada nenhuma.
      </p>
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "dd 'de' MMM", { locale: ptBR })
}