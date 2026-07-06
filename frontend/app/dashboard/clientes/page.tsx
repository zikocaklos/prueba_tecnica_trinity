"use client"

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Client } from '../../../src/types/client'
import { ClientFormValues } from '../../../src/schemas/client.schema'
import { useClients } from '../../../src/hooks/useClients'
import { useAccounts } from '../../../src/hooks/useAccounts'
import { ClientTable } from '../../../src/components/clientes/ClientTable'
import { ClientForm } from '../../../src/components/clientes/ClientForm'
import { ClientModal } from '../../../src/components/clientes/ClientModal'
import { ClientDetailsModal } from '../../../src/components/clientes/ClientDetailsModal'
import { ClientDeleteDialog } from '../../../src/components/clientes/ClientDeleteDialog'
import { Button } from '../../../src/components/ui/Button'
import { PageHeader } from '../../../src/components/ui/PageHeader'
import { Section } from '../../../src/components/ui/Section'
import { SearchBar } from '../../../src/components/ui/SearchBar'
import { LoadingSpinner } from '../../../src/components/ui/LoadingSpinner'
import { EmptyState } from '../../../src/components/ui/EmptyState'
import { calculateAge } from '../../../src/lib/client-utils'

const identificationFilterOptions = ['ALL', 'CC', 'CE', 'PASSPORT', 'NIT'] as const
const ageFilterOptions = ['ALL', 'ADULT', 'MINOR'] as const
const productFilterOptions = ['ALL', 'WITH_PRODUCTS', 'WITHOUT_PRODUCTS'] as const

export default function DashboardClientsPage() {
  const { clients = [], isLoading, error, refresh, create, update, remove } = useClients()
  const { accounts = [] } = useAccounts()
  const [searchQuery, setSearchQuery] = useState('')
  const [identificationFilter, setIdentificationFilter] = useState<(typeof identificationFilterOptions)[number]>('ALL')
  const [ageFilter, setAgeFilter] = useState<(typeof ageFilterOptions)[number]>('ALL')
  const [productFilter, setProductFilter] = useState<(typeof productFilterOptions)[number]>('ALL')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [activeClient, setActiveClient] = useState<Client | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [submitting, setSubmitting] = useState(false)

  const clientProductMap = useMemo(() => {
    const map = new Map<number, number>()
    accounts.forEach((account) => {
      if (account.client?.id) {
        map.set(account.client.id, (map.get(account.client.id) ?? 0) + 1)
      }
    })
    return map
  }, [accounts])

  const filteredClients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return clients.filter((client) => {
      const fullText = [client.firstName, client.lastName, client.identificationNumber, client.email]
        .join(' ')
        .toLowerCase()

      const matchesSearch = !query || fullText.includes(query)
      const matchesIdentification = identificationFilter === 'ALL' || client.identificationType === identificationFilter
      const age = calculateAge(client.birthDate)
      const matchesAge = ageFilter === 'ALL' || (ageFilter === 'ADULT' ? (age ?? 0) >= 18 : (age ?? 0) < 18)
      const accountCount = clientProductMap.get(client.id) ?? 0
      const matchesProducts = productFilter === 'ALL' || (productFilter === 'WITH_PRODUCTS' ? accountCount > 0 : accountCount === 0)

      return matchesSearch && matchesIdentification && matchesAge && matchesProducts
    })
  }, [clients, searchQuery, identificationFilter, ageFilter, productFilter, clientProductMap])

  const openCreate = () => {
    setFormMode('create')
    setActiveClient(null)
    setIsFormOpen(true)
  }

  const openEdit = (client: Client) => {
    setFormMode('edit')
    setActiveClient(client)
    setIsFormOpen(true)
  }

  const openDetails = (client: Client) => {
    setActiveClient(client)
    setIsDetailsOpen(true)
  }

  const openDelete = (client: Client) => {
    const productCount = clientProductMap.get(client.id) ?? 0
    if (productCount > 0) {
      toast.error('Este cliente posee productos financieros asociados y no puede ser eliminado.')
      return
    }

    setActiveClient(client)
    setIsDeleteOpen(true)
  }

  const handleSubmit = async (data: ClientFormValues) => {
    if (submitting) return

    try {
      setSubmitting(true)
      if (formMode === 'edit' && activeClient) {
        await update(String(activeClient.id), data)
        toast.success('Cliente actualizado correctamente')
      } else {
        await create(data)
        toast.success('Cliente creado correctamente')
      }
      setIsFormOpen(false)
      await refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Error al guardar el cliente')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!activeClient || submitting) return
    try {
      setSubmitting(true)
      await remove(String(activeClient.id))
      toast.success('Cliente eliminado correctamente')
      setIsDeleteOpen(false)
      await refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar el cliente')
    } finally {
      setSubmitting(false)
      setActiveClient(null)
    }
  }

  return (
    <main className="space-y-8">
      <Toaster position="top-right" />

      <PageHeader
        eyebrow="Gestión de clientes"
        title="Clientes"
        description="Administra los clientes registrados en la entidad financiera desde un panel seguro y profesional."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />Nuevo cliente
          </Button>
        }
      />

      <Section title="Operaciones y consulta" description="Consulta, filtra y gestiona clientes con una experiencia uniforme en todo el sistema.">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
          <div className="grid gap-4 md:grid-cols-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por nombre, apellido, documento o correo"
              ariaLabel="Buscar clientes"
            />
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <label className="text-sm font-medium text-slate-700">Tipo doc.</label>
                <select
                  value={identificationFilter}
                  onChange={(e) => setIdentificationFilter(e.target.value as (typeof identificationFilterOptions)[number])}
                  className="mt-3 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  {identificationFilterOptions.map((option) => (
                    <option key={option} value={option}>{option === 'ALL' ? 'Todos' : option}</option>
                  ))}
                </select>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <label className="text-sm font-medium text-slate-700">Mayor de edad</label>
                <select
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value as (typeof ageFilterOptions)[number])}
                  className="mt-3 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  {ageFilterOptions.map((option) => (
                    <option key={option} value={option}>{option === 'ALL' ? 'Todos' : option === 'ADULT' ? 'Sí' : 'No'}</option>
                  ))}
                </select>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <label className="text-sm font-medium text-slate-700">Productos</label>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value as (typeof productFilterOptions)[number])}
                  className="mt-3 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  {productFilterOptions.map((option) => (
                    <option key={option} value={option}>{option === 'ALL' ? 'Todos' : option === 'WITH_PRODUCTS' ? 'Con productos' : 'Sin productos'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-950">Clientes totales</p>
            <p className="mt-2 text-3xl font-semibold text-[#1E3A8A]">{clients.length}</p>
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredClients.length === 0 ? (
            <EmptyState
              title="No se encontraron clientes"
              description="Ajusta la búsqueda o registra un nuevo cliente para comenzar."
              action={<Button onClick={openCreate}>Crear cliente</Button>}
            />
          ) : (
            <ClientTable
              data={filteredClients}
              loading={false}
              onView={openDetails}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          )}
        </div>
      </Section>

      <ClientModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formMode === 'edit' ? 'Editar cliente' : 'Nuevo cliente'}
      >
        <ClientForm
          mode={formMode}
          defaultValues={
            formMode === 'edit' && activeClient
              ? {
                  identificationType: activeClient.identificationType,
                  identificationNumber: activeClient.identificationNumber,
                  firstName: activeClient.firstName,
                  lastName: activeClient.lastName,
                  email: activeClient.email,
                  birthDate: activeClient.birthDate.split('T')[0],
                }
              : undefined
          }
          onSubmit={handleSubmit}
        />
      </ClientModal>

      <ClientDetailsModal open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} client={activeClient} />

      <ClientDeleteDialog
        open={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        name={activeClient ? `${activeClient.firstName} ${activeClient.lastName}` : undefined}
      />

      {error && (
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Ocurrió un error al cargar los clientes. Por favor recarga la página o revisa la conexión con la API.
        </div>
      )}
    </main>
  )
}
