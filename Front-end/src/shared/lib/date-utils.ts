/**
 * Calcula o período [startMonth/startYear, endMonth/endYear]
 * recuando N meses a partir de uma data de referência.
 *
 * @param monthsBack  Quantidade de meses a recuar (ex: 12 para últimos 12 meses)
 * @param reference   Data de referência (default: hoje)
 *
 * @example
 *   // Hoje é junho/2026
 *   getMonthRange(12)  // => { startMonth: 7, startYear: 2025, endMonth: 6, endYear: 2026 }
 */
export function getMonthRange(monthsBack: number, reference: Date = new Date()) {
  const endMonth = reference.getMonth() + 1
  const endYear = reference.getFullYear()

  // Recua (monthsBack - 1) meses porque o endMonth já conta como 1
  let startMonth = endMonth - (monthsBack - 1)
  let startYear = endYear

  while (startMonth <= 0) {
    startMonth += 12
    startYear -= 1
  }

  return { startMonth, startYear, endMonth, endYear }
}