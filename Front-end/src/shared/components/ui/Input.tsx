import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary flex items-center gap-1">
          {label}
          {props.required && <span className="text-danger text-xs" aria-hidden="true">*</span>}
        </label>

        <input
          ref={ref}
          id={inputId}
          className={[
            'bg-bg-elevated border rounded-[10px] text-text-primary text-base px-4 py-3 w-full',
            'transition-all duration-150 placeholder:text-text-muted',
            'hover:border-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,230,118,0.12)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-danger focus:shadow-[0_0_0_3px_rgba(255,82,82,0.12)]' : 'border-border',
            className,
          ].filter(Boolean).join(' ')}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={[error ? errorId : '', hint ? hintId : ''].filter(Boolean).join(' ') || undefined}
          {...props}
        />

        {hint && !error && (
          <p id={hintId} className="text-xs text-text-muted">{hint}</p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-danger" role="alert">{error}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'