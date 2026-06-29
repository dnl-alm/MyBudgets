import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightSlot?: ReactNode   // ícone customizado à direita (ex: toggle de senha)
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightSlot, id, className = '', ...props }, ref) => {
    const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`

    return (
      <div className="flex flex-col gap-2">

        <label htmlFor={inputId}
          className="text-[13px] font-medium text-[#D4D4D8]">
          {label}
        </label>

        <div className="relative">
          {/* Ícone à esquerda */}
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525B] pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full bg-[#16161D] text-[#F4F4F5] text-[14px]',
              'py-2.5 rounded-lg outline-none',
              'border transition-all duration-150',
              'placeholder:text-[#52525B]',
              'hover:border-[#3F3F46]',
              'focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12)]',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightSlot ? 'pr-10' : 'pr-3.5',
              error
                ? 'border-[#F87171]/40 focus:border-[#F87171] focus:shadow-[0_0_0_3px_rgba(248,113,113,0.1)]'
                : 'border-[#27272A]',
              className,
            ].filter(Boolean).join(' ')}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          />

          {/* Slot à direita (ex: toggle de senha) */}
          {rightSlot && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              {rightSlot}
            </div>
          )}
        </div>

        {hint && !error && (
          <p className="text-[12px] text-[#52525B]">{hint}</p>
        )}
        {error && (
          <p className="text-[12px] text-[#F87171]" role="alert">{error}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'