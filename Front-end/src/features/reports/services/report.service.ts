import { http } from '@/shared/lib/http'
import type {
  SummaryResponse,
  ByCategoryResponse,
  EvolutionResponse,
  EvolutionParams,
} from '@/features/reports/types'
import type { TransactionType } from '@/features/transactions/types'

export interface ReportPeriod {
  month: number
  year: number
}

export interface ByCategoryParams extends ReportPeriod {
  type: TransactionType
}

export const reportService = {
  /**
   * Relatórios não têm HATEOAS — retorno direto sem extração.
   */
  getSummary: (period: ReportPeriod): Promise<SummaryResponse> =>
    http.get<SummaryResponse>('/reports/summary', period),

  getByCategory: (params: ByCategoryParams): Promise<ByCategoryResponse> =>
    http.get<ByCategoryResponse>('/reports/by-category', params),

  getEvolution: (params: EvolutionParams): Promise<EvolutionResponse> =>
    http.get<EvolutionResponse>('/reports/evolution', params),
}