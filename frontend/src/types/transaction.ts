import { Account } from './account'

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'

export interface AccountReference {
  id: number
}

export interface TransactionRequest {
  type: TransactionType
  amount: number
  sourceAccountId?: number
  destinationAccountId?: number
}

export interface Transaction {
  id: number
  type: TransactionType
  amount: number
  transactionDate: string
  sourceAccount: Account | null
  destinationAccount: Account | null
  deleted: boolean
}
