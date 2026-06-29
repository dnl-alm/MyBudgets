import { forwardRef, type ReactNode } from 'react'
import { NumericFormat, type NumberFormatValues } from 'react-number-format'
import { Input } from './Input'

interface CurrencyInputProps {
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  error?: string
  hint?: string
  placeholder?: string
  leftIcon?: ReactNode
  autoFocus?: boolean
  disabled?: boolean
}

/**
 * Input de moeda com máscara reativa brasileira (R$ 1.500,00).
 *
 * Integra react-number-format ao nosso componente Input,
 * preservando label, error e demais features.
 *
 * O valor exposto é sempre um number — a string formatada fica só na UI.
 */
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, value, onChange, error, hint, placeholder, leftIcon, autoFocus, disabled }, ref) => {
    return (
      <FormattedInput
        getInputRef={ref}
        customInput={Input}
        value={value ?? ''}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        prefix="R$ "
        onValueChange={(values: NumberFormatValues) => {
          onChange(values.floatValue)
        }}
        label={label}
        error={error}
        hint={hint}
        placeholder={placeholder ?? 'R$ 0,00'}
        leftIcon={leftIcon}
        autoFocus={autoFocus}
        disabled={disabled}
        inputMode="decimal"
      />
    )
  },
)

CurrencyInput.displayName = 'CurrencyInput'

/**
 * Cast do NumericFormat para aceitar props extras (label, error, etc.)
 * que serão repassadas ao customInput.
 *
 * A tipagem do react-number-format é muito restritiva — não consegue inferir
 * automaticamente as props do customInput. Fazemos o cast aqui em um lugar só
 * para que o consumidor (CurrencyInput) fique limpo.
 */
const FormattedInput = NumericFormat as unknown as React.ComponentType<Record<string, unknown>>