import { AccountStatus } from '../../types/account'
import { formatAccountStatus, getAccountStatusClasses } from '../../lib/account-utils'

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getAccountStatusClasses(status)}`}>
      <span className="mr-2 h-2.5 w-2.5 rounded-full bg-current" />
      {formatAccountStatus(status)}
    </span>
  )
}
