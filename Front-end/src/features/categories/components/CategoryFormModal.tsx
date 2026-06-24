import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Modal } from '@/shared/components/ui/Modal'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { ApiError } from '@/shared/lib/http'
import type { CategoryResponse, CategoryType, CreateCategoryRequest } from '@/features/categories/types'

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  /** Se fornecido, modo de edição. Se undefined, modo de criação. */
  category?: CategoryResponse
}

interface FormValues {
  name: string
  color: string
  type: CategoryType
}

// Paleta curada — cores que funcionam bem no tema dark e combinam em gráficos
const COLOR_PALETTE = [
  '#A78BFA', // roxo
  '#60A5FA', // azul
  '#22D3EE', // ciano
  '#4ADE80', // verde
  '#FACC15', // amarelo
  '#FB923C', // laranja
  '#F87171', // vermelho
  '#F472B6', // rosa
  '#A3A3A3', // cinza
  '#818CF8', // índigo
  '#34D399', // esmeralda
  '#FBBF24', // âmbar
]

const DEFAULT_COLOR = COLOR_PALETTE[0] ?? '#A78BFA'

export function CategoryFormModal({ isOpen, onClose, category }: CategoryFormModalProps) {
  const isEditMode = !!category
  const { createCategory, updateCategory, isCreating, isUpdating } = useCategories()
  const isSubmitting = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      color: DEFAULT_COLOR,
      type: 'EXPENSE',
    },
  })

  // Reseta o form quando o modal abre — preenche com dados se for edição
  useEffect(() => {
    if (!isOpen) return

    reset({
      name: category?.name ?? '',
      color: category?.color ?? DEFAULT_COLOR,
      type: category?.type ?? 'EXPENSE',
    })
  }, [isOpen, category, reset])

  const onSubmit = (data: FormValues) => {
    const payload: CreateCategoryRequest = {
      name: data.name.trim(),
      color: data.color,
      type: data.type,
    }

    const onSuccess = () => { onClose() }
    const onError = (error: unknown) => {
      if (error instanceof ApiError && error.status === 400) {
        setError('name', { message: error.message || 'Já existe uma categoria com esse nome.' })
      } else {
        setError('root', { message: error instanceof Error ? error.message : 'Erro inesperado.' })
      }
    }

    if (isEditMode) {
      updateCategory({ id: category.id, data: payload }, { onSuccess, onError })
    } else {
      createCategory(payload, { onSuccess, onError })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Editar categoria' : 'Nova categoria'}
      description={isEditMode
        ? 'Atualize os dados da categoria.'
        : 'Crie uma categoria para organizar suas transações.'
      }
    >
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-5" noValidate>

        {/* Nome */}
        <Input
          label="Nome"
          autoFocus
          placeholder="Ex: Alimentação"
          error={errors.name?.message}
          {...register('name', {
            required: 'Informe o nome.',
            minLength: { value: 2, message: 'Mínimo 2 caracteres.' },
            maxLength: { value: 50, message: 'Máximo 50 caracteres.' },
          })}
        />

        {/* Cor */}
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <ColorField value={field.value} onChange={field.onChange} />
          )}
        />

        {/* Tipo */}
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <TypeField value={field.value} onChange={field.onChange} />
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
            {isEditMode ? 'Salvar alterações' : 'Criar categoria'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Campo de Cor ───────────────────────────────────────────────────────────

interface ColorFieldProps {
  value: string
  onChange: (color: string) => void
}

function ColorField({ value, onChange }: ColorFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium text-[#D4D4D8]">Cor</label>

      <div className="grid grid-cols-6 gap-2">
        {COLOR_PALETTE.map((color) => {
          const isSelected = value.toLowerCase() === color.toLowerCase()
          return (
            <button
              key={color}
              type="button"
              onClick={() => { onChange(color) }}
              className={[
                'relative aspect-square rounded-lg transition-all duration-150',
                'hover:scale-105 active:scale-95',
                isSelected
                  ? 'ring-2 ring-offset-2 ring-offset-[#0F0F14]'
                  : 'ring-0',
              ].join(' ')}
              style={{
                backgroundColor: color,
                ...(isSelected && { ['--tw-ring-color' as string]: color }),
              }}
              aria-label={`Cor ${color}`}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <svg
                  className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Campo de Tipo ──────────────────────────────────────────────────────────

interface TypeFieldProps {
  value: CategoryType
  onChange: (type: CategoryType) => void
}

function TypeField({ value, onChange }: TypeFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium text-[#D4D4D8]">Tipo</label>

      <div className="grid grid-cols-2 gap-2">
        <TypeOption
          active={value === 'EXPENSE'}
          onClick={() => { onChange('EXPENSE') }}
          color="#F87171"
          label="Despesa"
          description="Saídas de dinheiro"
        />
        <TypeOption
          active={value === 'INCOME'}
          onClick={() => { onChange('INCOME') }}
          color="#4ADE80"
          label="Receita"
          description="Entradas de dinheiro"
        />
      </div>
    </div>
  )
}

interface TypeOptionProps {
  active: boolean
  onClick: () => void
  color: string
  label: string
  description: string
}

function TypeOption({ active, onClick, color, label, description }: TypeOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex flex-col items-start gap-1 p-3 rounded-lg border transition-all duration-150 text-left',
        active
          ? 'bg-[#7C3AED]/5 border-[#7C3AED]'
          : 'bg-[#16161D] border-[#27272A] hover:border-[#3F3F46]',
      ].join(' ')}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[13px] font-medium text-[#F4F4F5]">{label}</span>
      </div>
      <span className="text-[11px] text-[#71717A]">{description}</span>
    </button>
  )
}