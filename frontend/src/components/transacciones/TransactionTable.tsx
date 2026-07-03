"use client"

import { Eye } from 'lucide-react'
import { Transaction } from '../../types/transaction'
import { TransactionTypeBadge } from './TransactionTypeBadge'

type Props = {
  data: Transaction[]
  loading?: boolean
  onView: (transaction: Transaction) => void
}

export function TransactionTable({ data, loading, onView }: Props) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 w-2/5 rounded-md bg-slate-200" />
            <div className="mt-6 space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="grid grid-cols-7 gap-4 py-4">
                  {Array.from({ length: 7 }).map((__, cell) => (
                    <div key={cell} className="h-6 rounded-md bg-slate-200" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
        <p className="text-lg font-semibold">No se encontraron transacciones</p>
        <p className="mt-2 text-sm">Realiza una transacción para comenzar a ver el historial.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-2 bg-slate-50 p-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 sm:grid-cols-[70px_120px_1fr_1.2fr_1.2fr_120px]">
        <span>ID</span>
        <span>Tipo</span>
        <span className="text-right">Monto</span>
        <span>Fecha</span>
        <span>Cuenta Origen / Destino</span>
        <span className="text-right">Acciones</span>
      </div>
      <div className="space-y-3 p-4">
        {data.map((transaction) => (
          <div key={transaction.id} className="grid gap-2 rounded-[26px] border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:grid-cols-[70px_120px_1fr_1.2fr_1.2fr_120px] sm:items-center">
            <span className="font-medium text-slate-900">{transaction.id}</span>
            <span><TransactionTypeBadge type={transaction.type} /></span>
            <span className="text-right font-semibold text-slate-950">${transaction.amount.toFixed(2)}</span>
            <span>{new Date(transaction.transactionDate).toLocaleString('es-ES')}</span>
            <span>{transaction.sourceAccount?.accountNumber ?? '—'} → {transaction.destinationAccount?.accountNumber ?? '—'}</span>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                aria-label="Ver detalle"
                onClick={() => onView(transaction)}
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
