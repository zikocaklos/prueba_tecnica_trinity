"use client"

import { Account } from '../../types/account'
import { Modal } from '../ui/Modal'
import { AccountStatusBadge } from './AccountStatusBadge'

type Props = {
  open: boolean
  onClose: () => void
  account: Account | null
}

export function AccountDetailsModal({ open, onClose, account }: Props) {
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
            <p className="mt-2 font-medium text-slate-900">{`${account.client.firstName} ${account.client.lastName}`}</p>
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
