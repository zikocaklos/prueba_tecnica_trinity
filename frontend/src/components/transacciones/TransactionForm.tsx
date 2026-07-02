"use client"

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema, TransactionFormValues } from '../../schemas/transaction.schema'
import { Account } from '../../types/account'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

const transactionTypeOptions = [
  { value: 'DEPOSIT', label: 'Consignación' },
  { value: 'WITHDRAWAL', label: 'Retiro' },
  { value: 'TRANSFER', label: 'Transferencia' },
] as const

type Props = {
  accounts: Account[]
  defaultValues?: Partial<TransactionFormValues>
  onSubmit: (data: TransactionFormValues) => Promise<void>
}

export function TransactionForm({ accounts, defaultValues, onSubmit }: Props) {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  })

  const type = watch('type') || defaultValues?.type || 'DEPOSIT'

  useEffect(() => {
    if (!defaultValues) {
      setValue('type', 'DEPOSIT')
      setValue('amount', 0)
    }
  }, [defaultValues, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Select label="Tipo de transacción" {...register('type')}>
          {transactionTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
      </div>

      {type === 'DEPOSIT' && (
        <div>
          <Select label="Cuenta destino" {...register('destinationAccountId')}>
            <option value="">Selecciona una cuenta destino</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {`${account.accountNumber} — ${account.accountType} — Saldo ${account.balance.toFixed(2)}`}
              </option>
            ))}
          </Select>
          {errors.destinationAccountId && <p className="mt-1 text-sm text-red-600">{errors.destinationAccountId.message}</p>}
        </div>
      )}

      {type === 'WITHDRAWAL' && (
        <div>
          <Select label="Cuenta origen" {...register('sourceAccountId')}>
            <option value="">Selecciona una cuenta origen</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {`${account.accountNumber} — ${account.accountType} — Saldo ${account.balance.toFixed(2)}`}
              </option>
            ))}
          </Select>
          {errors.sourceAccountId && <p className="mt-1 text-sm text-red-600">{errors.sourceAccountId.message}</p>}
        </div>
      )}

      {type === 'TRANSFER' && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Select label="Cuenta origen" {...register('sourceAccountId')}>
              <option value="">Selecciona una cuenta origen</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {`${account.accountNumber} — ${account.accountType} — Saldo ${account.balance.toFixed(2)}`}
                </option>
              ))}
            </Select>
            {errors.sourceAccountId && <p className="mt-1 text-sm text-red-600">{errors.sourceAccountId.message}</p>}
          </div>
          <div>
            <Select label="Cuenta destino" {...register('destinationAccountId')}>
              <option value="">Selecciona una cuenta destino</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {`${account.accountNumber} — ${account.accountType} — Saldo ${account.balance.toFixed(2)}`}
                </option>
              ))}
            </Select>
            {errors.destinationAccountId && <p className="mt-1 text-sm text-red-600">{errors.destinationAccountId.message}</p>}
          </div>
        </div>
      )}

      <div>
        <Input
          id="amount"
          label="Valor"
          type="number"
          min="0.01"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
          aria-invalid={errors.amount ? 'true' : 'false'}
        />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Procesando...' : 'Crear transacción'}
        </Button>
      </div>
    </form>
  )
}
