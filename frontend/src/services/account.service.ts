import api from './api'
import { Account } from '../types/account'
import { AccountStatus, AccountType } from '../schemas/account.schema'

export type AccountCreatePayload = {
  clientId: number
  accountType: AccountType
  accountNumber?: string
  balance: number
  exemptGmf: boolean
  status?: AccountStatus
}

export type AccountUpdatePayload = {
  accountNumber?: string
  clientId?: number
  accountType?: AccountType
  balance?: number
  exemptGmf?: boolean
  status?: AccountStatus
}

const RESOURCE = '/accounts'

function buildAccountNumberPrefix(accountType: AccountType) {
  return accountType === 'SAVINGS' ? '53' : '33'
}

export function generateAccountNumber(accountType: AccountType, existingAccounts: Account[]) {
  const prefix = buildAccountNumberPrefix(accountType)
  const usableAccounts = (existingAccounts || []).filter((account) => !account.deleted)

  const usedNumbers = new Set(
    usableAccounts
      .filter((account) => account.accountNumber.startsWith(prefix))
      .map((account) => account.accountNumber)
  )

  const existingSuffixes = usableAccounts
    .filter((account) => account.accountNumber.startsWith(prefix))
    .map((account) => parseInt(account.accountNumber.slice(2), 10))
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => a - b)

  let nextSuffix = 1
  if (existingSuffixes.length > 0) {
    nextSuffix = existingSuffixes[existingSuffixes.length - 1] + 1
  }

  let candidate = ''
  do {
    candidate = prefix + String(nextSuffix).padStart(8, '0')
    nextSuffix += 1
  } while (usedNumbers.has(candidate))

  return candidate
}

export const accountService = {
  list: async () => {
    const res = await api.get(RESOURCE)
    return res.data as Account[]
  },
  get: async (id: string) => {
    const res = await api.get(`${RESOURCE}/${id}`)
    return res.data as Account
  },
  create: async (payload: AccountCreatePayload) => {
    const res = await api.post(RESOURCE, payload)
    return res.data as Account
  },
  update: async (id: string, payload: AccountUpdatePayload) => {
    const res = await api.put(`${RESOURCE}/${id}`, payload)
    return res.data as Account
  },
  remove: async (id: string) => {
    await api.delete(`${RESOURCE}/${id}`)
  },
}
