import api from './api'
import { Transaccion } from '../types'

export const transaccionService = {
  list: async (params?: any) => {
    const res = await api.get('/transacciones', { params })
    return res.data as Transaccion[]
  },
  create: async (payload: Partial<Transaccion>) => {
    const res = await api.post('/transacciones', payload)
    return res.data as Transaccion
  },
}
