"use client"

import { Transaction } from '../../types/transaction'
import { Modal } from '../ui/Modal'
import { TransactionTypeBadge } from './TransactionTypeBadge'

type Props = {
  open: boolean
  onClose: () => void
  transaction: Transaction | null
}

export function TransactionDetailsModal({ open, onClose, transaction }: Props) {
  if (!open || !transaction) return null

  return (
    <Modal open={open} onClose={onClose} title="Detalle de la transacción">
      <div className="space-y-5 text-sm text-slate-700">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">ID</p>
            <p className="mt-2 font-medium text-slate-900">{transaction.id}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Tipo</p>
            <TransactionTypeBadge type={transaction.type} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Monto</p>
            <p className="mt-2 font-medium text-slate-900">${transaction.amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Fecha</p>
            <p className="mt-2 font-medium text-slate-900">{new Date(transaction.transactionDate).toLocaleString('es-ES')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Cuenta origen</p>
            <p className="mt-2 font-medium text-slate-900">{transaction.sourceAccount ? transaction.sourceAccount.accountNumber : 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Cuenta destino</p>
            <p className="mt-2 font-medium text-slate-900">{transaction.destinationAccount ? transaction.destinationAccount.accountNumber : 'N/A'}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
