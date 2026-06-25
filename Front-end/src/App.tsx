import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/query-client'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { PublicOnlyRoute } from '@/shared/components/PublicOnlyRoute'
import { AppLayout } from '@/shared/components/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { BudgetsPage } from './pages/BudgetsPage'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rotas públicas */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Rotas protegidas com layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* Próximas rotas: */}
              {/* <Route path="/transactions" element={<TransactionsPage />} /> */}
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              {/* <Route path="/reports" element={<ReportsPage />} /> */}
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}