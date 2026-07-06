"use client"

import { Account } from '../../types/account'
import { Client } from '../../types/client'
import { Modal } from '../ui/Modal'
import { AccountStatusBadge } from './AccountStatusBadge'

type Props = {
  open: boolean
  onClose: () => void
  account: Account | null
  clients?: Client[]
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

export function AccountDetailsModal({ open, onClose, account, clients = [] }: Props) {
  if (!open || !account) return null

  return (
    <Modal open={open} onClose={onClose} title="Detalle de la cuenta">
      <div className="space-y-5 text-sm text-slate-700">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Número de cuenta</p>
            <p className="mt-2 font-medium text-slate-900">{account.accountNumber}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Tipo de cuenta</p>
            <p className="mt-2 font-medium text-slate-900">{account.accountType}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Cliente</p>
            <p className="mt-2 font-medium text-slate-900">{getClientDisplayName(account, clients)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Estado</p>
            <p className="mt-2"><AccountStatusBadge status={account.status} /></p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Saldo</p>
            <p className="mt-2 font-medium text-slate-900">${account.balance.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Exenta GMF</p>
            <p className="mt-2 font-medium text-slate-900">{account.exemptGmf ? 'Sí' : 'No'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Fecha creación</p>
            <p className="mt-2 font-medium text-slate-900">{new Date(account.createdAt).toLocaleString('es-ES')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Última actualización</p>
            <p className="mt-2 font-medium text-slate-900">{new Date(account.updatedAt).toLocaleString('es-ES')}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
