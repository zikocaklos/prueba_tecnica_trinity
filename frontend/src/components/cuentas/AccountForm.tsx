"use client"

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountSchema, AccountFormValues, AccountType, AccountStatus } from '../../schemas/account.schema'
import { Client } from '../../types/client'
import { Account } from '../../types/account'
import { generateAccountNumber } from '../../services/account.service'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

const typeOptions: { value: AccountType; label: string }[] = [
  { value: 'SAVINGS', label: 'Ahorros' },
  { value: 'CHECKING', label: 'Corriente' },
]

const statusOptions: { value: AccountStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'ACTIVO' },
  { value: 'INACTIVE', label: 'INACTIVO' },
  { value: 'CANCELLED', label: 'CANCELADO' },
]

type Props = {
  clients: Client[]
  existingAccounts: Account[]
  defaultValues?: Partial<AccountFormValues>
  mode: 'create' | 'edit'
  onSubmit: (data: AccountFormValues) => Promise<void>
}

export function AccountForm({ clients, existingAccounts, defaultValues, mode, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues,
  })

  const watchedAccountType = watch('accountType')

  useEffect(() => {
    const selectedType = watchedAccountType || defaultValues?.accountType || 'SAVINGS'
    if (!selectedType) return

    const generatedNumber = generateAccountNumber(selectedType as AccountType, existingAccounts)
    setValue('accountNumber', generatedNumber)

    if (!defaultValues) {
      setValue('accountType', selectedType as AccountType)
      setValue('balance', 0)
      setValue('exemptGmf', false)
      if (mode === 'create') {
        setValue('status', 'ACTIVE' as AccountStatus)
      }
    }
  }, [watchedAccountType, defaultValues, existingAccounts, mode, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {mode === 'create' && (
        <div>
          <Input
            id="accountNumber"
            label="Número de cuenta"
            readOnly
            {...register('accountNumber')}
          />
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Select label="Cliente" {...register('clientId')}>
            <option value="">Selecciona un cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {`${client.firstName} ${client.lastName} — ${client.identificationNumber}`}
              </option>
            ))}
          </Select>
          {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>}
        </div>

        <div>
          <Select label="Tipo de cuenta" {...register('accountType')}>
            <option value="">Selecciona un tipo</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
          {errors.accountType && <p className="mt-1 text-sm text-red-600">{errors.accountType.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Input
            id="balance"
            type="number"
            step="0.01"
            min="0"
            label="Saldo inicial"
            {...register('balance', { valueAsNumber: true })}
            aria-invalid={errors.balance ? 'true' : 'false'}
          />
          {errors.balance && <p className="mt-1 text-sm text-red-600">{errors.balance.message}</p>}
        </div>

        <div className="flex items-end gap-3">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input type="checkbox" {...register('exemptGmf')} />
            <span className="text-sm text-slate-700">Exenta GMF</span>
          </label>
        </div>
      </div>

      {mode === 'edit' && (
        <div>
          <Select label="Estado" {...register('status')}>
            <option value="">Selecciona un estado</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear cuenta' : 'Actualizar cuenta'}
        </Button>
      </div>
    </form>
  )
}
