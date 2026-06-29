import { useQuery } from '@tanstack/react-query'
import { reportService } from '../services/report.service'
import type { ReportPeriod, ByCategoryParams } from '../services/report.service'
import type { EvolutionParams } from '../types'

export const REPORTS_QUERY_KEY = 'reports' as const

export function useSummary(period: ReportPeriod) {
  return useQuery({
    queryKey: [REPORTS_QUERY_KEY, 'summary', period],
    queryFn: () => reportService.getSummary(period),
  })
}

export function useByCategory(params: ByCategoryParams) {
  return useQuery({
    queryKey: [REPORTS_QUERY_KEY, 'by-category', params],
    queryFn: () => reportService.getByCategory(params),
  })
}

export function useEvolution(params: EvolutionParams) {
  return useQuery({
    queryKey: [REPORTS_QUERY_KEY, 'evolution', params],
    queryFn: () => reportService.getEvolution(params),
  })
}