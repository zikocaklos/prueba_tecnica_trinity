"use client"

import { useMemo, useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Account } from '../../../src/types/account'
import { AccountFormValues } from '../../../src/schemas/account.schema'
import { useAccounts } from '../../../src/hooks/useAccounts'
import { useClients } from '../../../src/hooks/useClients'
import { AccountTable } from '../../../src/components/cuentas/AccountTable'
import { AccountForm } from '../../../src/components/cuentas/AccountForm'
import { AccountModal } from '../../../src/components/cuentas/AccountModal'
import { AccountDetailsModal } from '../../../src/components/cuentas/AccountDetailsModal'
import { AccountDeleteDialog } from '../../../src/components/cuentas/AccountDeleteDialog'
import { Button } from '../../../src/components/ui/Button'

const typeFilterOptions = ['ALL', 'SAVINGS', 'CHECKING'] as const
const statusFilterOptions = ['ALL', 'ACTIVE', 'INACTIVE', 'CANCELLED'] as const

export default function DashboardAccountsPage() {
  const { accounts = [], isLoading, error, refresh, create, update, remove } = useAccounts()
  const { clients = [] } = useClients()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<typeof typeFilterOptions[number]>('ALL')
  const [statusFilter, setStatusFilter] = useState<typeof statusFilterOptions[number]>('ALL')
  const [clientFilter, setClientFilter] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [activeAccount, setActiveAccount] = useState<Account | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return accounts.filter((account) => {
      const matchSearch = [account.accountNumber, account.client.firstName, account.client.lastName, account.accountType]
        .join(' ')
        .toLowerCase()
        .includes(query)

      const matchType = typeFilter === 'ALL' || account.accountType === typeFilter
      const matchStatus = statusFilter === 'ALL' || account.status === statusFilter
      const matchClient = !clientFilter || `${account.client.firstName} ${account.client.lastName}`.toLowerCase().includes(clientFilter.toLowerCase())

      return matchSearch && matchType && matchStatus && matchClient
    })
  }, [accounts, searchQuery, typeFilter, statusFilter, clientFilter])

  const openCreate = () => {
    setFormMode('create')
    setActiveAccount(null)
    setIsFormOpen(true)
  }

  const openEdit = (account: Account) => {
    setFormMode('edit')
    setActiveAccount(account)
    setIsFormOpen(true)
  }

  const openDetails = (account: Account) => {
    setActiveAccount(account)
    setIsDetailsOpen(true)
  }

  const openDelete = (account: Account) => {
    setActiveAccount(account)
    setIsDeleteOpen(true)
  }

  const handleSubmit = async (data: AccountFormValues) => {
    try {
      if (formMode === 'edit' && activeAccount) {
        await update(String(activeAccount.id), {
          balance: data.balance,
          exemptGmf: data.exemptGmf,
          status: data.status,
        })
        toast.success('Cuenta actualizada correctamente')
      } else {
        await create({
          accountNumber: data.accountNumber!,
          client: { id: Number(data.clientId) },
          accountType: data.accountType,
          balance: data.balance,
          exemptGmf: data.exemptGmf,
          status: 'ACTIVE',
        })
        toast.success('Cuenta creada correctamente')
      }
      setIsFormOpen(false)
      refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Error al guardar la cuenta')
    }
  }

  const handleDelete = async () => {
    if (!activeAccount) return
    try {
      await remove(String(activeAccount.id))
      toast.success('Cuenta eliminada correctamente')
      setIsDeleteOpen(false)
      refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar la cuenta')
    }
  }

  return (
    <main className="space-y-8 px-4 py-8 sm:px-6 lg:px-10">
      <Toaster position="top-right" />

      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">Gestión de Cuentas</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Administra cuentas de ahorro y cuentas corrientes asociadas a clientes</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Nueva Cuenta
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por número de cuenta, cliente o tipo"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
            aria-label="Buscar cuentas"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Filtrar por tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as typeof typeFilterOptions[number])}
              className="rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm outline-none focus:border-sky-500"
              aria-label="Filtrar por tipo de cuenta"
            >
              {typeFilterOptions.map((option) => (
                <option key={option} value={option}>{option === 'ALL' ? 'Todos los tipos' : option}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Filtrar por estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilterOptions[number])}
              className="rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm outline-none focus:border-sky-500"
              aria-label="Filtrar por estado"
            >
              {statusFilterOptions.map((option) => (
                <option key={option} value={option}>{option === 'ALL' ? 'Todos los estados' : option}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="block text-sm font-medium text-slate-700">Filtrar por cliente</label>
            <input
              type="text"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              placeholder="Nombre o identificación del cliente"
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
              aria-label="Filtrar por cliente"
            />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Clientes disponibles</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              {clients.slice(0, 4).map((client) => (
                <div key={client.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <p className="font-medium text-slate-900">{client.firstName} {client.lastName}</p>
                  <p className="text-slate-600">{client.identificationNumber}</p>
                </div>
              ))}
              {clients.length === 0 && <p className="text-slate-500">Cargando clientes...</p>}
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Resumen</p>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="flex items-center justify-between gap-2">
              <span>Total cuentas</span>
              <span className="font-semibold text-slate-900">{accounts.length}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span>Cuentas activas</span>
              <span className="font-semibold text-slate-900">{accounts.filter((acc) => acc.status === 'ACTIVE').length}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span>Cuentas canceladas</span>
              <span className="font-semibold text-slate-900">{accounts.filter((acc) => acc.status === 'CANCELLED').length}</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <AccountTable
          data={filteredAccounts}
          loading={isLoading}
          onView={openDetails}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </section>

      <AccountModal open={isFormOpen} onClose={() => setIsFormOpen(false)} title={formMode === 'edit' ? 'Editar cuenta' : 'Nueva cuenta'}>
        <AccountForm
          clients={clients}
          existingAccounts={accounts}
          mode={formMode}
          defaultValues={
            formMode === 'edit' && activeAccount
              ? {
                  clientId: String(activeAccount.client.id),
                  accountType: activeAccount.accountType,
                  balance: activeAccount.balance,
                  exemptGmf: activeAccount.exemptGmf,
                  status: activeAccount.status,
                }
              : {
                  accountType: 'SAVINGS',
                  balance: 0,
                  exemptGmf: false,
                  status: 'ACTIVE',
                }
          }
          onSubmit={handleSubmit}
        />
      </AccountModal>

      <AccountDetailsModal open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} account={activeAccount} />
      <AccountDeleteDialog open={isDeleteOpen} onCancel={() => setIsDeleteOpen(false)} onConfirm={handleDelete} />

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Ocurrió un error al cargar las cuentas. Por favor recarga la página.
        </div>
      )}
    </main>
  )
}
