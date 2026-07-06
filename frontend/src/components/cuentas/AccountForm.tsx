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
  { value: 'ACTIVE', label: 'Activa' },
  { value: 'INACTIVE', label: 'Inactiva' },
  { value: 'CANCELLED', label: 'Cancelada' },
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
    if (mode === 'edit') {
      setValue('accountNumber', defaultValues?.accountNumber ?? '')
      setValue('clientId', defaultValues?.clientId ?? '')
      setValue('accountType', defaultValues?.accountType ?? 'SAVINGS')
      setValue('balance', defaultValues?.balance ?? 0)
      setValue('exemptGmf', defaultValues?.exemptGmf ?? false)
      setValue('status', defaultValues?.status ?? 'ACTIVE')
      return
    }

    const selectedType = watchedAccountType || defaultValues?.accountType || 'SAVINGS'
    const generatedNumber = generateAccountNumber(selectedType as AccountType, existingAccounts)

    setValue('accountNumber', generatedNumber)
    setValue('accountType', selectedType as AccountType)
    setValue('balance', 0)
    setValue('exemptGmf', false)
    setValue('status', 'ACTIVE')
  }, [watchedAccountType, existingAccounts, mode, setValue, defaultValues])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Input id="accountNumber" label="Número de cuenta" readOnly {...register('accountNumber')} />
        <p className="mt-2 text-sm text-slate-500">El número de cuenta se genera automáticamente con el prefijo correspondiente.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Select label="Cliente" disabled={mode === 'edit'} {...register('clientId')}>
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
          <Select label="Tipo de cuenta" disabled={mode === 'edit'} {...register('accountType')}>
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
            readOnly={mode === 'edit'}
            label={mode === 'create' ? 'Saldo inicial' : 'Saldo actual'}
            {...register('balance', { valueAsNumber: true })}
            aria-invalid={errors.balance ? 'true' : 'false'}
          />
          {errors.balance && <p className="mt-1 text-sm text-red-600">{errors.balance.message}</p>}
          <p className="mt-2 text-sm text-slate-500">El saldo únicamente cambia mediante transacciones del sistema.</p>
        </div>

        <div className="flex items-end gap-3">
          <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
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
          <p className="mt-2 text-sm text-slate-500">Solo es posible modificar el estado y la exención GMF para una cuenta existente.</p>
        </div>
      )}

      {mode === 'edit' && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-700">El cliente, el número de cuenta, el tipo y el saldo no pueden modificarse desde este formulario.</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {mode === 'create' ? 'Crear cuenta' : 'Actualizar cuenta'}
        </Button>
      </div>
    </form>
  )
}
