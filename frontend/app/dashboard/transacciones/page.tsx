"use client"

import { useMemo, useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Transaction, TransactionRequest } from '../../../src/types/transaction'
import { TransactionFormValues } from '../../../src/schemas/transaction.schema'
import { useAccounts } from '../../../src/hooks/useAccounts'
import { useTransactions } from '../../../src/hooks/useTransactions'
import { TransactionTable } from '../../../src/components/transacciones/TransactionTable'
import { TransactionForm } from '../../../src/components/transacciones/TransactionForm'
import { TransactionModal } from '../../../src/components/transacciones/TransactionModal'
import { TransactionDetailsModal } from '../../../src/components/transacciones/TransactionDetailsModal'
import { Button } from '../../../src/components/ui/Button'
import { PageHeader } from '../../../src/components/ui/PageHeader'
import { Section } from '../../../src/components/ui/Section'
import { SearchBar } from '../../../src/components/ui/SearchBar'
import { LoadingSpinner } from '../../../src/components/ui/LoadingSpinner'
import { EmptyState } from '../../../src/components/ui/EmptyState'

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

    const payload: TransactionRequest = {
      type: data.type,
      amount: data.amount,
      sourceAccountId: data.sourceAccountId ? Number(data.sourceAccountId) : undefined,
      destinationAccountId: data.destinationAccountId ? Number(data.destinationAccountId) : undefined,
    }

    try {
      await create(payload)
      toast.success('Transacción registrada correctamente')
      setIsModalOpen(false)
      refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al crear la transacción'
      toast.error(message)
    }
  }

  return (
    <main className="space-y-8">
      <Toaster position="top-right" />

      <PageHeader
        eyebrow="Gestión de transacciones"
        title="Transacciones"
        description="Registra consignaciones, retiros y transferencias con controles visuales claros y profesionales."
        actions={<Button onClick={openCreate}><Plus className="h-4 w-4" />Nueva transacción</Button>}
      />

      <Section title="Consulta y filtros" description="Filtra transacciones y consulta el historial sin perder claridad visual.">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por ID, tipo o número de cuenta"
            ariaLabel="Buscar transacciones"
          />
          <div className="grid gap-3">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <label className="text-sm font-medium text-slate-700">Filtrar por tipo</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as typeof transactionTypeFilters[number])}
                className="mt-3 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-sky-100"
                aria-label="Filtrar por tipo de transacción"
              >
                {transactionTypeFilters.map((option) => (
                  <option key={option} value={option}>
                    {option === 'ALL' ? 'Todos los tipos' : option}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Estado de datos</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                <ArrowRight className="h-4 w-4 text-slate-400" />
                {accountsLoading || transactionsLoading ? 'Cargando datos...' : 'Datos sincronizados'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {transactionsLoading ? (
            <LoadingSpinner />
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              title="No se encontraron transacciones"
              description="Intenta con otros filtros o regista una nueva transacción."
              action={<Button onClick={openCreate}>Crear transacción</Button>}
            />
          ) : (
            <TransactionTable data={filteredTransactions} loading={false} onView={openDetails} />
          )}
        </div>
      </Section>

      <TransactionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva transacción">
        <div className="space-y-6">
          <TransactionForm accounts={accounts} onSubmit={handleCreateTransaction} />
        </div>
      </TransactionModal>

      <TransactionDetailsModal open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} transaction={activeTransaction} />

      {error && (
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Ocurrió un error al cargar las transacciones. Por favor recarga la página o revisa la conexión con la API.
        </div>
      )}
    </main>
  )
}
