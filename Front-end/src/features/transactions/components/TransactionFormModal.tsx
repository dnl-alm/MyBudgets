import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'
import { Modal } from '@/shared/components/ui/Modal'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { CurrencyInput } from '@/shared/components/ui/CurrencyInput'
import { CategorySelect } from '@/features/categories/components/CategorySelect'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { ApiError } from '@/shared/lib/http'
import type {
  TransactionResponse,
  TransactionType,
  CreateTransactionRequest,
} from '@/features/transactions/types'

interface TransactionFormModalProps {
  isOpen: boolean
  onClose: () => void
  transaction?: TransactionResponse
}

interface FormValues {
  type: TransactionType
  description: string
  amount: number | undefined
  date: string
  categoryId: number | undefined
}

export function TransactionFormModal({
  isOpen,
  onClose,
  transaction,
}: TransactionFormModalProps) {
  const isEditMode = !!transaction
  const { createTransaction, updateTransaction, isCreating, isUpdating } = useTransactions()
  const { categories } = useCategories()
  const isSubmitting = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      type: 'EXPENSE',
      description: '',
      amount: undefined,
      date: format(new Date(), 'yyyy-MM-dd'),
      categoryId: undefined,
    },
  })

  const currentType = watch('type')

  useEffect(() => {
    if (!isOpen) return

    clearErrors()
    reset({
      type: transaction?.type ?? 'EXPENSE',
      description: transaction?.description ?? '',
      amount: transaction?.amount ?? undefined,
      date: transaction?.date ?? format(new Date(), 'yyyy-MM-dd'),
      categoryId: transaction?.category.id ?? undefined,
    })
  }, [isOpen, transaction, reset, clearErrors])

  const onSubmit = (data: FormValues) => {
    if (!data.categoryId) {
      setError('categoryId', { message: 'Selecione uma categoria.' })
      return
    }

    // Valida consistência tipo vs categoria
    const selectedCategory = categories.find((c) => c.id === data.categoryId)
    if (selectedCategory && selectedCategory.type !== data.type) {
      setError('categoryId', {
        message: `Esta categoria é de ${selectedCategory.type === 'INCOME' ? 'receita' : 'despesa'}. Selecione uma categoria compatível.`,
      })
      return
    }

    if (!data.amount || data.amount <= 0) {
      setError('amount', { message: 'Informe um valor maior que zero.' })
      return
    }
    if (!data.description.trim()) {
      setError('description', { message: 'Informe uma descrição.' })
      return
    }

    const payload: CreateTransactionRequest = {
      type: data.type,
      description: data.description.trim(),
      amount: data.amount,
      date: data.date,
      categoryId: data.categoryId,
    }

    const onSuccess = () => { onClose() }
    const onError = (error: unknown) => {
      if (error instanceof ApiError) {
        setError('root', { message: error.message })
      } else {
        setError('root', { message: 'Erro inesperado.' })
      }
    }

    if (isEditMode) {
      updateTransaction({ id: transaction.id, data: payload }, { onSuccess, onError })
    } else {
      createTransaction(payload, { onSuccess, onError })
    }
  }

  const handleTypeChange = (newType: TransactionType) => {
    setValue('type', newType)
    setValue('categoryId', undefined)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Editar transação' : 'Nova transação'}
      description={isEditMode
        ? 'Atualize os dados da transação.'
        : 'Registre uma entrada ou saída de dinheiro.'
      }
    >
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-5" noValidate>

        {/* Tipo */}
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <TypeField value={field.value} onChange={handleTypeChange} />
          )}
        />

        {/* Descrição */}
        <Input
          label="Descrição"
          placeholder="Ex: Mercado, Salário"
          error={errors.description?.message}
          {...register('description', {
            required: 'Informe uma descrição.',
            minLength: { value: 2, message: 'Mínimo 2 caracteres.' },
            maxLength: { value: 100, message: 'Máximo 100 caracteres.' },
          })}
        />

        {/* Valor + Data lado a lado */}
        <div className="grid grid-cols-2 gap-3">
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <CurrencyInput
                label="Valor"
                value={field.value}
                onChange={field.onChange}
                error={errors.amount?.message}
              />
            )}
          />

          <Input
            label="Data"
            type="date"
            error={errors.date?.message}
            {...register('date', {
              required: 'Informe a data.',
            })}
          />
        </div>

        {/* Categoria */}
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <CategorySelect
              label="Categoria"
              value={field.value}
              onChange={field.onChange}
              filterByType={currentType}
              error={errors.categoryId?.message}
            />
          )}
        />

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
            {isEditMode ? 'Salvar alterações' : 'Criar transação'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Campo de Tipo ──────────────────────────────────────────────────────────

interface TypeFieldProps {
  value: TransactionType
  onChange: (type: TransactionType) => void
}

function TypeField({ value, onChange }: TypeFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium text-[#D4D4D8]">Tipo</label>

      <div className="grid grid-cols-2 gap-2">
        <TypeOption
          active={value === 'EXPENSE'}
          onClick={() => { onChange('EXPENSE') }}
          icon={<ArrowUpRight size={16} />}
          color="#F87171"
          label="Despesa"
          description="Saída"
        />
        <TypeOption
          active={value === 'INCOME'}
          onClick={() => { onChange('INCOME') }}
          icon={<ArrowDownLeft size={16} />}
          color="#4ADE80"
          label="Receita"
          description="Entrada"
        />
      </div>
    </div>
  )
}

interface TypeOptionProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  color: string
  label: string
  description: string
}

function TypeOption({ active, onClick, icon, color, label, description }: TypeOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 text-left',
        active
          ? 'bg-[#7C3AED]/5 border-[#7C3AED]'
          : 'bg-[#16161D] border-[#27272A] hover:border-[#3F3F46]',
      ].join(' ')}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}1F`, color }}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[13px] font-medium text-[#F4F4F5] leading-tight">{label}</span>
        <span className="text-[11px] text-[#71717A] leading-tight mt-0.5">{description}</span>
      </div>
    </button>
  )
}