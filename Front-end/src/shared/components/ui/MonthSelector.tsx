import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MonthSelectorProps {
  month: number
  year: number
  label: string   // ex: "Junho de 2026"
  onPrevious: () => void
  onNext: () => void
}

/**
 * Seletor de mês com setas ← Mês → .
 * Padrão consagrado em apps financeiros e calendários.
 */
export function MonthSelector({ label, onPrevious, onNext }: MonthSelectorProps) {
  return (
    <div className="inline-flex items-center bg-[#13131A] border border-[#1F1F26] rounded-lg">
      <NavButton onClick={onPrevious} ariaLabel="Mês anterior">
        <ChevronLeft size={16} />
      </NavButton>

      <div className="px-4 py-1.5 min-w-[160px] text-center
                      text-[13px] font-medium text-[#F4F4F5]
                      border-x border-[#1F1F26]">
        {label}
      </div>

      <NavButton onClick={onNext} ariaLabel="Próximo mês">
        <ChevronRight size={16} />
      </NavButton>
    </div>
  )
}

function NavButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick: () => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="px-3 h-9 flex items-center justify-center text-[#71717A]
                 hover:text-[#F4F4F5] hover:bg-[#1F1F26] transition-colors"
    >
      {children}
    </button>
  )
}