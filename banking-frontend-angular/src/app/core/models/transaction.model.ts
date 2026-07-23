import { Account } from './account.model';

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  transactionDate: string;
  sourceAccount: Account | null;
  destinationAccount: Account | null;
  deleted: boolean;
}

export interface TransactionRequest {
  type: TransactionType;
  amount: number;
  sourceAccountId?: number;
  destinationAccountId?: number;
}
