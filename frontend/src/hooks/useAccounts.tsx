"use client"

import useSWR from 'swr'
import { accountService } from '../services/account.service'
import { Account } from '../types/account'

export function useAccounts() {
  const { data, error, isLoading, mutate } = useSWR('/accounts', accountService.list)

  return {
    accounts: data as Account[] | undefined,
    error,
    isLoading,
    refresh: mutate,
    create: accountService.create,
    update: accountService.update,
    remove: accountService.remove,
  }
}
