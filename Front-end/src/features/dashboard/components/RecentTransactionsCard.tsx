import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { format, parseISO, isToday, isYesterday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import type { TransactionResponse } from '@/features/transactions/types'

interface RecentTransactionsCardProps {
  transactions: TransactionResponse[]
  isLoading: boolean
}

export function RecentTransactionsCard({
  transactions,
  isLoading,
}: RecentTransactionsCardProps) {
  return (
    <div className="col-span-12 lg:col-span-5 bg-[#13131A] border border-[#1F1F26] rounded-2xl p-6
                    flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-medium text-[#A1A1AA] uppercase tracking-wider">
          Transações recentes
        </span>
        <Link
          to="/transactions"
          className="text-[11px] text-[#A78BFA] hover:text-[#C4B5FD] font-medium transition-colors"
        >
          Ver todas →
        </Link>
      </div>

      {/* Conteúdo */}
      {isLoading ? (
        <RecentTransactionsSkeleton />
      ) : transactions.length === 0 ? (
        <RecentTransactionsEmpty />
      ) : (
        <div className="flex-1 space-y-1 -mx-2 overflow-y-auto">
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Linha de transação ─────────────────────────────────────────────────────

function TransactionRow({ transaction }: { transaction: TransactionResponse }) {
  const isIncome = transaction.type === 'INCOME'

  return (
    <div className="flex items-center gap-3 px-2 py-2.5 rounded-lg
                    hover:bg-[#1F1F26] transition-colors duration-150">

      {/* Ícone com cor da categoria */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${transaction.category.color}20` }}
      >
        {isIncome ? (
          <ArrowDownLeft size={16} style={{ color: transaction.category.color }} />
        ) : (
          <ArrowUpRight size={16} style={{ color: transaction.category.color }} />
        )}
      </div>

      {/* Descrição e categoria */}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-[#F4F4F5] truncate">
          {transaction.description}
        </div>
        <div className="text-[11px] text-[#71717A] truncate">
          {transaction.category.name} · {formatRelativeDate(transaction.date)}
        </div>
      </div>

      {/* Valor */}
      <div
        className={[
          'text-[13px] font-semibold font-mono tabular-nums shrink-0',
          isIncome ? 'text-[#4ADE80]' : 'text-[#F87171]',
        ].join(' ')}
      >
        {isIncome ? '+' : '−'} {formatCurrency(transaction.amount)}
      </div>
    </div>
  )
}

// ─── Estados auxiliares ─────────────────────────────────────────────────────

function RecentTransactionsSkeleton() {
  return (
    <div className="flex-1 space-y-1 -mx-2 animate-pulse">
      {[...Array<number>(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-2 py-2.5">
          <div className="w-9 h-9 rounded-full bg-[#1F1F26] shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 bg-[#1F1F26] rounded" />
            <div className="h-2.5 w-24 bg-[#1F1F26] rounded" />
          </div>
          <div className="h-3 w-20 bg-[#1F1F26] rounded" />
        </div>
      ))}
    </div>
  )
}

function RecentTransactionsEmpty() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-[13px] text-[#71717A] text-center">
        Nenhuma transação registrada<br />ainda.
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

/**
 * Formata a data de forma humana — "Hoje", "Ontem" ou a data em pt-BR.
 */
function formatRelativeDate(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Hoje'
  if (isYesterday(date)) return 'Ontem'
  return format(date, "d 'de' MMM", { locale: ptBR })
}