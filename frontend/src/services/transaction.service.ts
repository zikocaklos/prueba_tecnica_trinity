import api from './api'
import { Transaction } from '../types/transaction'

const RESOURCE = '/transactions'

export const transactionService = {
  list: async () => {
    const res = await api.get(RESOURCE)
    return res.data as Transaction[]
  },
  get: async (id: string) => {
    const res = await api.get(`${RESOURCE}/${id}`)
    return res.data as Transaction
  },
  create: async (payload: any) => {
    const res = await api.post(RESOURCE, payload)
    return res.data as Transaction
  },
}
