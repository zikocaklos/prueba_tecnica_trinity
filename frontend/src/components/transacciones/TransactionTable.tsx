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
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">ID</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Tipo</th>
            <th className="px-4 py-4 text-right text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Monto</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Fecha</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Cuenta Origen</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Cuenta Destino</th>
            <th className="px-4 py-4 text-right text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-slate-50">
              <td className="px-4 py-4 text-sm text-slate-700">{transaction.id}</td>
              <td className="px-4 py-4 text-sm text-slate-700"><TransactionTypeBadge type={transaction.type} /></td>
              <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">${transaction.amount.toFixed(2)}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{new Date(transaction.transactionDate).toLocaleString('es-ES')}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{transaction.sourceAccount?.accountNumber ?? 'N/A'}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{transaction.destinationAccount?.accountNumber ?? 'N/A'}</td>
              <td className="px-4 py-4 text-right text-sm text-slate-700">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  aria-label="Ver detalle"
                  onClick={() => onView(transaction)}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
