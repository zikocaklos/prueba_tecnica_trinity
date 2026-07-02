import api from './api'
import { Cliente } from '../types/cliente'

const BASE = '/clientes'

export const clienteService = {
  getAll: async (params?: Record<string, any>) => {
    const res = await api.get(BASE, { params })
    return res.data as Cliente[]
  },
  getById: async (id: string) => {
    const res = await api.get(`${BASE}/${id}`)
    return res.data as Cliente
  },
  create: async (payload: Omit<Cliente, 'id' | 'fechaCreacion' | 'fechaModificacion'>) => {
    const res = await api.post(BASE, payload)
    return res.data as Cliente
  },
  update: async (id: string, payload: Partial<Cliente>) => {
    const res = await api.put(`${BASE}/${id}`, payload)
    return res.data as Cliente
  },
  delete: async (id: string) => {
    const res = await api.delete(`${BASE}/${id}`)
    return res.data
  },
}
