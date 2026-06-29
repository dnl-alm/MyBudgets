import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { CurrencyInput } from '@/shared/components/ui/CurrencyInput'
import { MonthSelector } from '@/shared/components/ui/MonthSelector'
import { CategorySelect } from '@/features/categories/components/CategorySelect'
import { useBudgets } from '@/features/budgets/hooks/useBudgets'
import { shiftPeriod, formatPeriod } from '@/features/budgets/utils/budget-period'
import { ApiError } from '@/shared/lib/http'
import type { BudgetResponse, CreateBudgetRequest } from '@/features/budgets/types'

interface BudgetFormModalProps {
  isOpen: boolean
  onClose: () => void
  /** Se fornecido, modo de edição. Se undefined, modo de criação. */
  budget?: BudgetResponse
  /** Período padrão para criação. */
  defaultPeriod: { month: number; year: number }
}

interface FormValues {
  categoryId: number | undefined
  limitAmount: number | undefined
  month: number
  year: number
}

export function BudgetFormModal({
  isOpen,
  onClose,
  budget,
  defaultPeriod,
}: BudgetFormModalProps) {
  const isEditMode = !!budget
  const { createBudget, updateBudget, isCreating, isUpdating } = useBudgets(defaultPeriod)
  const isSubmitting = isCreating || isUpdating

  const {
    handleSubmit,
    control,
    reset,
    setError,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      categoryId: undefined,
      limitAmount: undefined,
      month: defaultPeriod.month,
      year: defaultPeriod.year,
    },
  })

  // Observa month/year para o MonthSelector
  const currentMonth = watch('month')
  const currentYear = watch('year')

  // Reset ao abrir — limpa erros e restaura valores
  useEffect(() => {
    if (!isOpen) return

    clearErrors()
    reset({
      categoryId: budget?.category.id ?? undefined,
      limitAmount: budget?.limitAmount ?? undefined,
      month: budget?.month ?? defaultPeriod.month,
      year: budget?.year ?? defaultPeriod.year,
    })
  }, [isOpen, budget, defaultPeriod, reset, clearErrors])

  const onSubmit = (data: FormValues) => {
    if (!data.categoryId) {
      setError('categoryId', { message: 'Selecione uma categoria.' })
      return
    }
    if (!data.limitAmount || data.limitAmount <= 0) {
      setError('limitAmount', { message: 'Informe um valor maior que zero.' })
      return
    }

    const payload: CreateBudgetRequest = {
      categoryId: data.categoryId,
      limitAmount: data.limitAmount,
      month: data.month,
      year: data.year,
    }

    const onSuccess = () => { onClose() }
    const onError = (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.status === 400 || error.status === 409) {
          setError('root', {
            message: 'Já existe um orçamento para essa categoria no período selecionado.',
          })
        } else {
          setError('root', { message: error.message })
        }
      } else {
        setError('root', { message: 'Erro inesperado.' })
      }
    }

    if (isEditMode) {
      updateBudget({ id: budget.id, data: payload }, { onSuccess, onError })
    } else {
      createBudget(payload, { onSuccess, onError })
    }
  }

  const navigatePeriod = (delta: number) => {
    const next = shiftPeriod({ month: currentMonth, year: currentYear }, delta)
    setValue('month', next.month)
    setValue('year', next.year)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Editar orçamento' : 'Novo orçamento'}
      description={isEditMode
        ? 'Atualize o limite do orçamento.'
        : 'Defina um limite de gastos para uma categoria.'
      }
    >
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-5" noValidate>

        {/* Categoria — desabilitada no modo edição */}
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            isEditMode && budget ? (
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#D4D4D8]">Categoria</label>
                <div className="flex items-center gap-2.5 bg-[#16161D] border border-[#27272A]
                                rounded-lg px-3.5 py-2.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: budget.category.color }}
                  />
                  <span className="text-[14px] text-[#A1A1AA] flex-1">
                    {budget.category.name}
                  </span>
                  <span className="text-[11px] text-[#71717A]">
                    Não editável
                  </span>
                </div>
              </div>
            ) : (
              <CategorySelect
                label="Categoria"
                value={field.value}
                onChange={field.onChange}
                error={errors.categoryId?.message}
              />
            )
          )}
        />

        {/* Limite */}
        <Controller
          control={control}
          name="limitAmount"
          render={({ field }) => (
            <CurrencyInput
              label="Limite"
              value={field.value}
              onChange={field.onChange}
              error={errors.limitAmount?.message}
              hint="Valor máximo que você planeja gastar nessa categoria."
            />
          )}
        />

        {/* Período */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-medium text-[#D4D4D8]">Período</label>
          <MonthSelector
            month={currentMonth}
            year={currentYear}
            label={formatPeriod({ month: currentMonth, year: currentYear })}
            onPrevious={() => { navigatePeriod(-1) }}
            onNext={() => { navigatePeriod(1) }}
          />
        </div>

        {/* Erro global */}
        {errors.root && (
          <div className="bg-[#F87171]/8 border border-[#F87171]/15 rounded-lg px-3.5 py-2.5">
            <p className="text-[13px] text-[#FCA5A5]">{errors.root.message}</p>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditMode ? 'Salvar alterações' : 'Criar orçamento'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}