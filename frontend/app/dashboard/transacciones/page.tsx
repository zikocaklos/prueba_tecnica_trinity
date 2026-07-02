"use client"

import { useMemo, useState } from 'react'
import { ArrowRight, Plus, Search } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Account } from '../../../src/types/account'
import { Transaction } from '../../../src/types/transaction'
import { TransactionFormValues } from '../../../src/schemas/transaction.schema'
import { useAccounts } from '../../../src/hooks/useAccounts'
import { useTransactions } from '../../../src/hooks/useTransactions'
import { TransactionTable } from '../../../src/components/transacciones/TransactionTable'
import { TransactionForm } from '../../../src/components/transacciones/TransactionForm'
import { TransactionModal } from '../../../src/components/transacciones/TransactionModal'
import { TransactionDetailsModal } from '../../../src/components/transacciones/TransactionDetailsModal'
import { Button } from '../../../src/components/ui/Button'

const transactionTypeFilters = ['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'] as const

export default function DashboardTransactionsPage() {
  const { accounts = [], isLoading: accountsLoading } = useAccounts()
  const { transactions = [], isLoading: transactionsLoading, error, refresh, create } = useTransactions()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<typeof transactionTypeFilters[number]>('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null)

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return transactions.filter((transaction) => {
      const matchType = typeFilter === 'ALL' || transaction.type === typeFilter
      const matchSearch =
        !query ||
        [String(transaction.id), transaction.type, transaction.sourceAccount?.accountNumber, transaction.destinationAccount?.accountNumber]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)

      return matchType && matchSearch
    })
  }, [transactions, searchQuery, typeFilter])

  const openCreate = () => {
    setActiveTransaction(null)
    setIsModalOpen(true)
  }

  const openDetails = (transaction: Transaction) => {
    setActiveTransaction(transaction)
    setIsDetailsOpen(true)
  }

  const handleCreateTransaction = async (data: TransactionFormValues) => {
    if (!create) return

    const payload: any = {
      type: data.type,
      amount: data.amount,
    }

    if (data.type === 'DEPOSIT') {
      payload.destinationAccount = { id: Number(data.destinationAccountId) }
    }

    if (data.type === 'WITHDRAWAL') {
      payload.sourceAccount = { id: Number(data.sourceAccountId) }
    }

    if (data.type === 'TRANSFER') {
      payload.sourceAccount = { id: Number(data.sourceAccountId) }
      payload.destinationAccount = { id: Number(data.destinationAccountId) }
    }

    try {
      await create(payload)
      toast.success('Transacción registrada correctamente')
      setIsModalOpen(false)
      refresh()
    } catch (error: any) {
      toast.error(error?.message || 'Error al crear la transacción')
    }
  }

  return (
    <main className="space-y-8 px-4 py-8 sm:px-6 lg:px-10">
      <Toaster position="top-right" />

      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">Gestión de Transacciones</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Registra consignaciones, retiros y transferencias entre cuentas</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Las transacciones se ejecutan sobre cuentas reales y actualizan saldos directamente en el backend.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Nueva Transacción
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por ID, tipo o número de cuenta"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
            aria-label="Buscar transacciones"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Filtrar por tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as typeof transactionTypeFilters[number])}
              className="rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm outline-none focus:border-sky-500"
              aria-label="Filtrar por tipo de transacción"
            >
              {transactionTypeFilters.map((option) => (
                <option key={option} value={option}>
                  {option === 'ALL' ? 'Todos los tipos' : option}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Estado de datos</label>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <ArrowRight className="h-4 w-4 text-slate-400" />
              {accountsLoading || transactionsLoading ? 'Cargando datos...' : 'Datos sincronizados'}
            </div>
          </div>
        </div>
      </section>

      <section>
        <TransactionTable data={filteredTransactions} loading={transactionsLoading} onView={openDetails} />
      </section>

      <TransactionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva transacción">
        <div className="space-y-6">
          <TransactionForm accounts={accounts} onSubmit={handleCreateTransaction} />
        </div>
      </TransactionModal>

      <TransactionDetailsModal open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} transaction={activeTransaction} />

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Ocurrió un error al cargar las transacciones. Por favor recarga la página o revisa la conexión con la API.
        </div>
      )}
    </main>
  )
}
