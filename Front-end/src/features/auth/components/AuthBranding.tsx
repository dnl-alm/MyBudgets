import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface AuthBrandingProps {
  headline: ReactNode
  subline: string
}

/**
 * Painel esquerdo das telas de autenticação.
 * Mostra a marca + pitch do produto + visual hero.
 * Oculto em mobile.
 */
export function AuthBranding({ headline, subline }: AuthBrandingProps) {
  return (
    <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:max-w-[560px]
                    bg-[#0B0B12] border-r border-[#1F1F26]
                    relative overflow-hidden p-12">

      {/* Glow ambiente */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px]
                      bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px]
                      bg-[#7C3AED]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo no topo */}
      <Link to="/" className="relative flex items-center gap-2.5 mb-auto">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#A78BFA] to-[#7C3AED]
                        flex items-center justify-center
                        shadow-[0_2px_8px_rgba(124,58,237,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M3 12V4l5 6 5-6v8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[16px] font-semibold text-[#F4F4F5] tracking-tight">
          MyBudgets
        </span>
      </Link>

      {/* Headline + card hero */}
      <div className="relative">

        {/* Headline */}
        <h2 className="text-[36px] font-semibold text-[#F4F4F5] tracking-tight leading-[1.15] mb-3">
          {headline}
        </h2>
        <p className="text-[15px] text-[#A1A1AA] leading-relaxed max-w-[420px] mb-10">
          {subline}
        </p>

        {/* Card hero — espelha o card de saldo do app */}
        <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6]
                        rounded-2xl p-6 max-w-[400px]
                        shadow-[0_20px_60px_-15px_rgba(124,58,237,0.4)]
                        border border-white/10">

          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] text-white/70 font-medium">Saldo disponível</span>
            <span className="text-[11px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
              Este mês
            </span>
          </div>

          <div className="text-[32px] font-semibold text-white tracking-tight mt-2">
            R$ 4.850,<span className="text-white/70">00</span>
          </div>

          <div className="flex gap-6 mt-5 pt-5 border-t border-white/10">
            <div>
              <div className="text-[11px] text-white/60 uppercase tracking-wider mb-1">Receitas</div>
              <div className="text-[14px] font-medium text-[#4ADE80]">+ R$ 7.250,00</div>
            </div>
            <div>
              <div className="text-[11px] text-white/60 uppercase tracking-wider mb-1">Despesas</div>
              <div className="text-[14px] font-medium text-[#FCA5A5]">- R$ 2.400,00</div>
            </div>
          </div>

          {/* Linha decorativa simulando gráfico */}
          <svg className="mt-5 w-full" height="40" viewBox="0 0 320 40" fill="none">
            <path
              d="M0 30 Q40 25 80 28 T160 18 T240 15 T320 8"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M0 30 Q40 25 80 28 T160 18 T240 15 T320 8 L320 40 L0 40 Z"
              fill="url(#chartGradient)"
            />
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Selos de confiança no rodapé */}
      <div className="relative flex items-center gap-6 mt-auto pt-12">
        <div className="flex items-center gap-2 text-[12px] text-[#71717A]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Dados criptografados</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#71717A]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <span>Sem cartão de crédito</span>
        </div>
      </div>
    </div>
  )
}