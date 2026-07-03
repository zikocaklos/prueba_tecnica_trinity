"use client"

import { Eye, Edit3, Trash2 } from 'lucide-react'
import { Account } from '../../types/account'
import { AccountStatusBadge } from './AccountStatusBadge'

type Props = {
  data: Account[]
  loading?: boolean
  onView: (account: Account) => void
  onEdit: (account: Account) => void
  onDelete: (account: Account) => void
}

export function AccountTable({ data, loading, onView, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 w-2/5 rounded-md bg-slate-200" />
            <div className="mt-6 space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="grid grid-cols-8 gap-4 py-4">
                  {Array.from({ length: 8 }).map((_, column) => (
                    <div key={column} className="h-6 rounded-md bg-slate-200" />
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
        <p className="text-lg font-semibold">No se encontraron cuentas</p>
        <p className="mt-2 text-sm">Registra una nueva cuenta para comenzar a administrarla.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead className="bg-slate-50 rounded-t-[28px]">
          <tr>
            <th className="rounded-tl-[28px] px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Número Cuenta</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Tipo Cuenta</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Cliente</th>
            <th className="px-4 py-4 text-right text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Saldo</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Estado</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Exenta GMF</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Fecha Creación</th>
            <th className="rounded-tr-[28px] px-4 py-4 text-right text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-transparent">
          {data.map((account) => (
            <tr key={account.id} className="hover:bg-slate-50">
              <td className="px-4 py-4 text-sm text-slate-700">{account.accountNumber}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{account.accountType}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{`${account.client.firstName} ${account.client.lastName}`}</td>
              <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">${account.balance.toFixed(2)}</td>
              <td className="px-4 py-4 text-sm text-slate-700">
                <AccountStatusBadge status={account.status} />
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">{account.exemptGmf ? 'Sí' : 'No'}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{new Date(account.createdAt).toLocaleDateString('es-ES')}</td>
              <td className="px-4 py-4 text-right text-sm text-slate-700">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    aria-label="Ver detalle"
                    onClick={() => onView(account)}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    aria-label="Editar cuenta"
                    onClick={() => onEdit(account)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-red-600 transition hover:border-red-300 hover:text-red-800"
                    aria-label="Eliminar cuenta"
                    onClick={() => onDelete(account)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
