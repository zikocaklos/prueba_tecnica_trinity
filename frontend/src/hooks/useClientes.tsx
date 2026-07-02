"use client"
import useSWR, { mutate } from 'swr'
import { clienteService } from '../services/cliente.service'
import api from '../services/api'
import { Cliente } from '../types/cliente'

const fetcher = async (url: string) => {
  // delegate to axios baseURL
  const res = await api.get(url.replace(/^\//, ''))
  return res.data
}

export function useClientes(params?: Record<string, any>) {
  const key = params ? ['/clientes', JSON.stringify(params)] : '/clientes'
  const { data, error, isLoading } = useSWR(key as any, () => clienteService.getAll(params))

  const refresh = async () => {
    await mutate(key as any)
  }

  const create = async (payload: any) => {
    const created = await clienteService.create(payload)
    await refresh()
    return created as Cliente
  }

  const update = async (id: string, payload: any) => {
    const updated = await clienteService.update(id, payload)
    await refresh()
    return updated as Cliente
  }

  const remove = async (id: string) => {
    await clienteService.delete(id)
    await refresh()
  }

  return {
    clientes: data as Cliente[] | undefined,
    error,
    isLoading,
    refresh,
    create,
    update,
    remove,
  }
}
