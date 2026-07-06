"use client"

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
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
import { PageHeader } from '../../../src/components/ui/PageHeader'
import { Section } from '../../../src/components/ui/Section'
import { SearchBar } from '../../../src/components/ui/SearchBar'
import { LoadingSpinner } from '../../../src/components/ui/LoadingSpinner'
import { EmptyState } from '../../../src/components/ui/EmptyState'
import { canDeleteAccount } from '../../../src/lib/account-utils'

const typeFilterOptions = ['ALL', 'SAVINGS', 'CHECKING'] as const
const statusFilterOptions = ['ALL', 'ACTIVE', 'INACTIVE', 'CANCELLED'] as const

export default function DashboardAccountsPage() {
  const { accounts = [], isLoading, error, refresh, create, update, remove } = useAccounts()
  const { clients = [] } = useClients()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<(typeof typeFilterOptions)[number]>('ALL')
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilterOptions)[number]>('ALL')
  const [clientFilter, setClientFilter] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [activeAccount, setActiveAccount] = useState<Account | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [submitting, setSubmitting] = useState(false)

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

  const closeForms = () => {
    setIsFormOpen(false)
    setIsDetailsOpen(false)
    setIsDeleteOpen(false)
    setActiveAccount(null)
  }

  const openCreate = () => {
    setFormMode('create')
    setActiveAccount(null)
    setIsFormOpen(true)
  }

  const openEdit = (account: Account) => {
    if (account.status === 'CANCELLED') return
    setFormMode('edit')
    setActiveAccount(account)
    setIsFormOpen(true)
  }

  const openDetails = (account: Account) => {
    setActiveAccount(account)
    setIsDetailsOpen(true)
  }

  const openDelete = (account: Account) => {
    if (account.balance > 0) {
      toast.error('No es posible eliminar una cuenta con saldo disponible.')
      return
    }

    if (!canDeleteAccount(account)) {
      toast.error('No es posible eliminar una cuenta cancelada o con saldo disponible.')
      return
    }

    setActiveAccount(account)
    setIsDeleteOpen(true)
  }

  const handleSubmit = async (data: AccountFormValues) => {
    if (submitting) return

    try {
      setSubmitting(true)
      if (formMode === 'edit' && activeAccount) {
        await update(String(activeAccount.id), {
          accountNumber: data.accountNumber || activeAccount.accountNumber,
          clientId: Number(data.clientId || activeAccount.client.id),
          accountType: data.accountType || activeAccount.accountType,
          balance: data.balance,
          exemptGmf: data.exemptGmf,
          status: data.status,
        })
        toast.success('Cuenta actualizada correctamente')
      } else {
        await create({
          accountNumber: data.accountNumber!,
          clientId: Number(data.clientId),
          accountType: data.accountType,
          balance: data.balance,
          exemptGmf: data.exemptGmf,
          status: 'ACTIVE',
        })
        toast.success('Cuenta creada correctamente')
      }
      closeForms()
      await refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Error al guardar la cuenta')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!activeAccount || submitting) return
    try {
      setSubmitting(true)
      await remove(String(activeAccount.id))
      toast.success('Cuenta eliminada correctamente')
      setIsDeleteOpen(false)
      await refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar la cuenta')
    } finally {
      setSubmitting(false)
      setActiveAccount(null)
    }
  }

  const handleToggleStatus = async (account: Account) => {
    if (submitting || account.status === 'CANCELLED') return

    try {
      setSubmitting(true)
      const newStatus = account.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

      await update(String(account.id), {
        accountNumber: account.accountNumber,
        clientId: account.client?.id,
        accountType: account.accountType,
        balance: account.balance,
        exemptGmf: account.exemptGmf,
        status: newStatus,
      })

      toast.success(newStatus === 'ACTIVE' ? 'Cuenta activada correctamente.' : 'Cuenta inactivada correctamente.')
      await refresh()
    } catch (err: any) {
      toast.error(err?.message || 'No fue posible actualizar el estado.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="space-y-8">
      <Toaster position="top-right" />

      <PageHeader
        eyebrow="Gestión de cuentas"
        title="Cuentas"
        description="Administra las cuentas de ahorro y corrientes vinculadas a clientes con una experiencia clara y profesional."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />Nueva cuenta
          </Button>
        }
      />

      <Section title="Consulta y filtros" description="Filtra cuentas por tipo, estado o cliente para operar de forma ágil y ordenada.">
        <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por número, cliente o tipo"
              ariaLabel="Buscar cuentas"
            />
            <div className="grid gap-3">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <label className="text-sm font-medium text-slate-700">Filtrar por tipo</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as (typeof typeFilterOptions)[number])}
                  className="mt-3 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-sky-100"
                  aria-label="Filtrar por tipo de cuenta"
                >
                  {typeFilterOptions.map((option) => (
                    <option key={option} value={option}>{option === 'ALL' ? 'Todos los tipos' : option}</option>
                  ))}
                </select>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <label className="text-sm font-medium text-slate-700">Filtrar por estado</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as (typeof statusFilterOptions)[number])}
                  className="mt-3 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-sky-100"
                  aria-label="Filtrar por estado"
                >
                  {statusFilterOptions.map((option) => (
                    <option key={option} value={option}>{option === 'ALL' ? 'Todos los estados' : option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Resumen</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-2">
                <span>Total cuentas</span>
                <span className="font-semibold text-[#1E3A8A]">{accounts.length}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Cuentas activas</span>
                <span className="font-semibold text-[#1E3A8A]">{accounts.filter((acc) => acc.status === 'ACTIVE').length}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Cuentas canceladas</span>
                <span className="font-semibold text-[#1E3A8A]">{accounts.filter((acc) => acc.status === 'CANCELLED').length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredAccounts.length === 0 ? (
            <EmptyState
              title="No se encontraron cuentas"
              description="Prueba con otros filtros o crea una nueva cuenta para comenzar."
              action={<Button onClick={openCreate}>Crear cuenta</Button>}
            />
          ) : (
            <AccountTable
              data={filteredAccounts}
              loading={false}
              clients={clients}
              onView={openDetails}
              onEdit={openEdit}
              onDelete={openDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </div>
      </Section>

      <AccountModal open={isFormOpen} onClose={() => setIsFormOpen(false)} title={formMode === 'edit' ? 'Editar cuenta' : 'Nueva cuenta'}>
        <AccountForm
          clients={clients}
          existingAccounts={accounts}
          mode={formMode}
          defaultValues={
            formMode === 'edit' && activeAccount
              ? {
                  accountNumber: activeAccount.accountNumber,
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

      <AccountDetailsModal open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} account={activeAccount} clients={clients} />
      <AccountDeleteDialog open={isDeleteOpen} onCancel={() => setIsDeleteOpen(false)} onConfirm={handleDelete} />

      {error && (
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Ocurrió un error al cargar las cuentas. Por favor recarga la página.
        </div>
      )}
    </main>
  )
}
