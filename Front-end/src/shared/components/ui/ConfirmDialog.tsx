import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: ReactNode
  /** Texto do botão de confirmar. Default 'Confirmar'. */
  confirmLabel?: string
  /** Texto do botão de cancelar. Default 'Cancelar'. */
  cancelLabel?: string
  /** Variante visual do botão de confirmar. Default 'danger'. */
  variant?: 'danger' | 'primary'
  /** Loading do botão de confirmar (ex: enquanto a mutation roda). */
  isLoading?: boolean
  /** Mensagem de erro a exibir após tentativa falha. */
  errorMessage?: string
}

/**
 * Dialog de confirmação reutilizável.
 *
 * Composição: usa o Modal como base, adiciona ícone + estrutura padrão de
 * confirmação. Outras telas (delete transação, delete orçamento, logout, etc.)
 * vão reutilizar.
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  errorMessage,
}: ConfirmDialogProps) {

  const iconBg = variant === 'danger' ? '#F87171' : '#7C3AED'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="flex flex-col gap-5 -mt-2">

        {/* Ícone + descrição */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${iconBg}1A`,  // 10% opacity
              color: iconBg,
            }}
          >
            <AlertTriangle size={18} />
          </div>
          <div className="text-[14px] text-[#A1A1AA] leading-relaxed flex-1 pt-1.5">
            {description}
          </div>
        </div>

        {/* Erro */}
        {errorMessage && (
          <div className="bg-[#F87171]/8 border border-[#F87171]/15 rounded-lg px-3.5 py-2.5">
            <p className="text-[13px] text-[#FCA5A5]">{errorMessage}</p>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}