import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  BarChart2,
  Tag,
  Settings,
  LogOut,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useLogout } from '@/features/auth/hooks/useAuth'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Visão geral',  to: '/dashboard',     icon: <LayoutDashboard size={18} /> },
  { label: 'Transações',   to: '/transactions',  icon: <ArrowLeftRight size={18} /> },
  { label: 'Orçamentos',   to: '/budgets',       icon: <Target size={18} /> },
  { label: 'Relatórios',   to: '/reports',       icon: <BarChart2 size={18} /> },
  { label: 'Categorias',   to: '/categories',    icon: <Tag size={18} /> },
  { label: 'Configurações',to: '/settings',      icon: <Settings size={18} /> },
]

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const [balanceVisible, setBalanceVisible] = useState(true)

  // Iniciais do nome para o avatar
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'MB'

  return (
    <aside className="w-[240px] shrink-0 h-screen sticky top-0 bg-[#0F0F14]
                  border-r border-[#1F1F26]
                  flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[#1F1F26] shrink-0">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#A78BFA] to-[#7C3AED]
                        flex items-center justify-center shrink-0
                        shadow-[0_2px_8px_rgba(124,58,237,0.3)]">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 12V4l5 6 5-6v8" stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[14px] font-semibold text-[#F4F4F5] tracking-tight">
          MyBudgets
        </span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => [
              'flex items-center gap-3 px-3 py-2.5 rounded-lg',
              'text-[13px] font-medium transition-all duration-150',
              isActive
                ? 'bg-[#7C3AED]/12 text-[#A78BFA]'
                : 'text-[#71717A] hover:bg-[#1F1F26] hover:text-[#D4D4D8]',
            ].join(' ')}
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-[#A78BFA]' : 'text-[#52525B]'}>
                  {item.icon}
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Saldo total */}
      <div className="px-4 py-4 border-t border-[#1F1F26]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-[#52525B] uppercase tracking-wider font-medium">
            Saldo total
          </span>
          <button
            onClick={() => setBalanceVisible((v) => !v)}
            className="text-[#52525B] hover:text-[#A1A1AA] transition-colors"
            aria-label={balanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
          >
            {balanceVisible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
        </div>
        <div className="text-[18px] font-semibold text-[#F4F4F5] tracking-tight font-mono">
          {balanceVisible ? 'R$ 4.850,00' : '••••••••'}
        </div>
      </div>

      {/* Perfil + logout */}
      <div className="px-3 py-3 border-t border-[#1F1F26]">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg
                        hover:bg-[#1F1F26] transition-colors duration-150 group">

          {/* Avatar com iniciais */}
          <div className="w-7 h-7 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30
                          flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-[#A78BFA]">
              {initials}
            </span>
          </div>

          {/* Nome e email */}
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-[#D4D4D8] truncate">
              {user?.name ?? 'Usuário'}
            </div>
            <div className="text-[10px] text-[#52525B] truncate">
              {user?.email ?? ''}
            </div>
          </div>

          {/* Botão de logout */}
          <button
            onClick={logout}
            className="text-[#52525B] hover:text-[#F87171] transition-colors duration-150
                       opacity-0 group-hover:opacity-100"
            aria-label="Sair"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}