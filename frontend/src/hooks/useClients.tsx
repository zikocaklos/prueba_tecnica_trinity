"use client"

import useSWR from 'swr'
import { clientService } from '../services/client.service'
import { Client } from '../types/client'

export function useClients() {
  const { data, error, isLoading, mutate } = useSWR('/clients', clientService.list)

  return {
    clients: data as Client[] | undefined,
    error,
    isLoading,
    refresh: mutate,
    create: clientService.create,
    update: clientService.update,
    remove: clientService.remove,
  }
}
