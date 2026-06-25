/**
 * Resolve o período (month/year) a partir de query params da URL.
 *
 * Aceita parâmetros como string (vindos da URL) e retorna números válidos.
 * Se algum estiver ausente ou inválido, usa o mês/ano atual como fallback.
 */
export interface BudgetPeriodResolved {
  month: number   // 1-12
  year: number
}

export function resolveBudgetPeriod(
  monthParam: string | null,
  yearParam: string | null,
): BudgetPeriodResolved {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const parsedMonth = monthParam ? parseInt(monthParam, 10) : NaN
  const parsedYear = yearParam ? parseInt(yearParam, 10) : NaN

  const month = isValidMonth(parsedMonth) ? parsedMonth : currentMonth
  const year = isValidYear(parsedYear) ? parsedYear : currentYear

  return { month, year }
}

function isValidMonth(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 12
}

function isValidYear(value: number): boolean {
  return Number.isInteger(value) && value >= 2000 && value <= 2100
}

/**
 * Avança ou recua um período em N meses.
 *
 * @example
 *   shiftPeriod({ month: 12, year: 2026 }, 1)   // { month: 1, year: 2027 }
 *   shiftPeriod({ month: 1, year: 2026 }, -1)   // { month: 12, year: 2025 }
 */
export function shiftPeriod(period: BudgetPeriodResolved, delta: number): BudgetPeriodResolved {
  let month = period.month + delta
  let year = period.year

  while (month > 12) {
    month -= 12
    year += 1
  }
  while (month < 1) {
    month += 12
    year -= 1
  }

  return { month, year }
}

/**
 * Formata o período como "Junho de 2026".
 */
export function formatPeriod(period: BudgetPeriodResolved): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]
  return `${months[period.month - 1]} de ${period.year}`
}