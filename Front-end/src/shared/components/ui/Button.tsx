import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-inverse hover:bg-accent-hover shadow-[0_0_20px_rgba(0,230,118,0.15)]',
  ghost: 'bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
  outline: 'bg-transparent text-accent border border-accent/25 hover:bg-accent/10',
  danger: 'bg-danger/10 text-danger hover:bg-danger hover:text-white',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 h-8',
  md: 'text-sm px-5 h-10',
  lg: 'text-base px-6 h-12',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold rounded-[10px]',
        'cursor-pointer transition-all duration-150 active:translate-y-px',
        'disabled:opacity-45 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span className="w-[14px] h-[14px] border-2 border-current border-t-transparent rounded-full animate-spin opacity-80" />
      )}
      {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </button>
  )
}