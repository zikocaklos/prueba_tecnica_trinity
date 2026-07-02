import { TransactionType } from '../../types/transaction'

const badgeStyles: Record<TransactionType, string> = {
  DEPOSIT: 'bg-emerald-100 text-emerald-800',
  WITHDRAWAL: 'bg-red-100 text-red-800',
  TRANSFER: 'bg-sky-100 text-sky-800',
}

export function TransactionTypeBadge({ type }: { type: TransactionType }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[type]}`}>
      {type}
    </span>
  )
}
