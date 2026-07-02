import { Client } from './client'

export type AccountType = 'SAVINGS' | 'CHECKING'
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'CANCELLED'

export interface Account {
  id: number
  accountNumber: string
  accountType: AccountType
  status: AccountStatus
  balance: number
  exemptGmf: boolean
  createdAt: string
  updatedAt: string
  client: Client
  deleted: boolean
}
