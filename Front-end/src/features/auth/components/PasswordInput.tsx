import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  hint?: string
}

/**
 * Input de senha com toggle de visibilidade.
 * Encapsula o estado local do toggle — o consumidor só precisa passar
 * as props normais de um input.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    return (
      <Input
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        leftIcon={<Lock size={16} />}
        rightSlot={
          <button
            type="button"
            onClick={() => setIsVisible((v) => !v)}
            className="p-1.5 rounded-md text-[#52525B] hover:text-[#A1A1AA] hover:bg-[#1F1F26]
                       transition-colors duration-150"
            aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
            tabIndex={-1}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...props}
      />
    )
  },
)

PasswordInput.displayName = 'PasswordInput'