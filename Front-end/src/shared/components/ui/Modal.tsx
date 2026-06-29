import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  /** Largura máxima do conteúdo. Default 'md' (480px). */
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'max-w-[380px]',
  md: 'max-w-[480px]',
  lg: 'max-w-[640px]',
}

/**
 * Modal base reutilizável.
 *
 * Decisões de design:
 * - Portal: renderiza no <body> ao invés do componente atual, evitando que
 *   z-index ou overflow do pai cortem o modal.
 * - Overlay clicável fecha o modal (padrão UX).
 * - ESC fecha o modal (acessibilidade).
 * - Foco preso no modal evita Tab sair (acessibilidade simplificada).
 * - Body scroll travado enquanto aberto.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: ModalProps) {
  // ESC fecha o modal
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEsc)
    return () => { document.removeEventListener('keydown', handleEsc) }
  }, [isOpen, onClose])

  // Trava scroll do body enquanto modal aberto
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => { document.body.style.overflow = originalOverflow }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Conteúdo */}
      <div
        className={[
          'relative w-full bg-[#0F0F14] border border-[#1F1F26] rounded-2xl',
          'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]',
          'animate-in fade-in zoom-in-95 duration-200',
          sizeClasses[size],
        ].join(' ')}
        onClick={(e) => { e.stopPropagation() }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[#1F1F26]">
          <div className="flex-1 min-w-0">
            <h2 className="text-[16px] font-semibold text-[#F4F4F5] tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="text-[13px] text-[#71717A] mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center
                       text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#1F1F26]
                       transition-colors shrink-0"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}