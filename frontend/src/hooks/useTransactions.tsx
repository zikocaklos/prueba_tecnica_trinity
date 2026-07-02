"use client"

import useSWR from 'swr'
import { transactionService } from '../services/transaction.service'
import { Transaction } from '../types/transaction'

export function useTransactions() {
  const { data, error, isLoading, mutate } = useSWR('/transactions', transactionService.list)

  return {
    transactions: data as Transaction[] | undefined,
    error,
    isLoading,
    refresh: mutate,
    create: transactionService.create,
  }
}
