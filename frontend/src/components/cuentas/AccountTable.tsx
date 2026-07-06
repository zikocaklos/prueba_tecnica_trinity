"use client"

import { useState } from 'react'
import { Eye, Edit3, Trash2, Power, ChevronDown } from 'lucide-react'
import { Account } from '../../types/account'
import { Client } from '../../types/client'
import { AccountStatusBadge } from './AccountStatusBadge'
import { canDeleteAccount, canEditAccount, canToggleAccount, formatAccountType, formatCurrency, getBalanceStateClasses, getBalanceStateLabel } from '../../lib/account-utils'

type Props = {
  data: Account[]
  loading?: boolean
  clients?: Client[]
  onView: (account: Account) => void
  onEdit: (account: Account) => void
  onDelete: (account: Account) => void
  onToggleStatus: (account: Account) => void
}

function getClientDisplayName(account: Account, clients: Client[] = []) {
  const matchedClient = clients.find((client) => client.id === account.client?.id)

  if (matchedClient) {
    return `${matchedClient.firstName} ${matchedClient.lastName}`.trim()
  }

  if (account.client?.firstName || account.client?.lastName) {
    return `${account.client?.firstName ?? ''} ${account.client?.lastName ?? ''}`.trim()
  }

  return 'Sin cliente asignado'
}

export function AccountTable({ data, loading, clients = [], onView, onEdit, onDelete, onToggleStatus }: Props) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

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
            <th className="rounded-tl-[28px] px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Número</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Cliente</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Tipo</th>
            <th className="px-4 py-4 text-right text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Saldo</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Estado</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">GMF</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Fecha creación</th>
            <th className="rounded-tr-[28px] px-4 py-4 text-right text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-transparent">
          {data.map((account) => (
            <tr key={account.id} className="hover:bg-slate-50">
              <td className="px-4 py-4 text-sm font-semibold text-slate-900">{account.accountNumber}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{getClientDisplayName(account, clients)}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{formatAccountType(account.accountType)}</td>
              <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">
                <div className="flex flex-col items-end">
                  <span>{formatCurrency(account.balance)}</span>
                  <span className={`mt-1 text-xs font-medium ${getBalanceStateClasses(account.balance)}`}>{getBalanceStateLabel(account.balance)}</span>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">
                <AccountStatusBadge status={account.status} />
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">{account.exemptGmf ? 'Sí' : 'No'}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{new Date(account.createdAt).toLocaleDateString('es-ES')}</td>
              <td className="px-4 py-4 text-right text-sm text-slate-700">
                <div className="relative inline-flex">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm"
                    onClick={() => setOpenMenuId(openMenuId === account.id ? null : account.id)}
                  >
                    Acciones
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {openMenuId === account.id && (
                    <div className="absolute right-0 z-10 mt-12 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                      <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={() => { onView(account); setOpenMenuId(null) }}>
                        <Eye className="h-4 w-4" /> Ver detalle
                      </button>
                      <button type="button" disabled={!canEditAccount(account)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { onEdit(account); setOpenMenuId(null) }}>
                        <Edit3 className="h-4 w-4" /> Editar
                      </button>
                      <button type="button" disabled={!canToggleAccount(account)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-amber-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { onToggleStatus(account); setOpenMenuId(null) }}>
                        <Power className="h-4 w-4" /> {account.status === 'ACTIVE' ? 'Inactivar' : 'Activar'}
                      </button>
                      <button type="button" disabled={!canDeleteAccount(account)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { onDelete(account); setOpenMenuId(null) }}>
                        <Trash2 className="h-4 w-4" /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
