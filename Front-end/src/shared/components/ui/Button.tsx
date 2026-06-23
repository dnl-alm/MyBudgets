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

const variants: Record<Variant, string> = {
  primary: [
    'bg-gradient-to-b from-[#8B5CF6] to-[#7C3AED] text-white',
    'shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)]',
    'hover:from-[#7C3AED] hover:to-[#6D28D9]',
    'hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_3px_rgba(124,58,237,0.15),inset_0_1px_0_rgba(255,255,255,0.15)]',
  ].join(' '),
  ghost: 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]',
  outline: 'border border-[#27272A] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-[#F4F4F5] bg-[#16161D]',
  danger: 'text-[#F87171] hover:bg-[#F87171]/10',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] rounded-md',
  md: 'h-9 px-3.5 text-[13px] rounded-lg',
  lg: 'h-10 px-4 text-[14px] rounded-lg',
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
        'inline-flex items-center justify-center gap-1.5 font-medium',
        'transition-all duration-150 cursor-pointer select-none',
        'active:translate-y-px',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-[1.5px] border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}