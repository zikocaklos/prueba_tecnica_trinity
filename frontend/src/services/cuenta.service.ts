import api from './api'
import { Cuenta } from '../types'

export const cuentaService = {
  list: async (params?: any) => {
    const res = await api.get('/cuentas', { params })
    return res.data as Cuenta[]
  },
  get: async (id: string) => {
    const res = await api.get(`/cuentas/${id}`)
    return res.data as Cuenta
  },
  create: async (payload: Partial<Cuenta>) => {
    const res = await api.post('/cuentas', payload)
    return res.data as Cuenta
  },
  update: async (id: string, payload: Partial<Cuenta>) => {
    const res = await api.put(`/cuentas/${id}`, payload)
    return res.data as Cuenta
  },
  remove: async (id: string) => {
    const res = await api.delete(`/cuentas/${id}`)
    return res.data
  },
}
