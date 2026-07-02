import api from './api'
import { Client } from '../types/client'

export type ClientPayload = Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>

const RESOURCE = '/clients'

export const clientService = {
  list: async () => {
    const res = await api.get(RESOURCE)
    return res.data as Client[]
  },
  get: async (id: string) => {
    const res = await api.get(`${RESOURCE}/${id}`)
    return res.data as Client
  },
  create: async (payload: ClientPayload) => {
    const res = await api.post(RESOURCE, payload)
    return res.data as Client
  },
  update: async (id: string, payload: Partial<ClientPayload>) => {
    const res = await api.put(`${RESOURCE}/${id}`, payload)
    return res.data as Client
  },
  remove: async (id: string) => {
    await api.delete(`${RESOURCE}/${id}`)
  },
}
