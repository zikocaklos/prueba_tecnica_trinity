"use client"

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Client } from '../../../src/types/client'
import { ClientFormValues } from '../../../src/schemas/client.schema'
import { useClients } from '../../../src/hooks/useClients'
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

export default function DashboardClientsPage() {
  const { clients = [], isLoading, error, refresh, create, update, remove } = useClients()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [activeClient, setActiveClient] = useState<Client | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const filteredClients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return clients
    return clients.filter((client) =>
      [client.firstName, client.lastName, client.identificationNumber]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [clients, searchQuery])

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
    setActiveClient(client)
    setIsDeleteOpen(true)
  }

  const handleSubmit = async (data: ClientFormValues) => {
    try {
      if (formMode === 'edit' && activeClient) {
        await update(String(activeClient.id), data)
        toast.success('Cliente actualizado correctamente')
      } else {
        await create(data)
        toast.success('Cliente creado correctamente')
      }
      setIsFormOpen(false)
      refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Error al guardar el cliente')
    }
  }

  const handleDelete = async () => {
    if (!activeClient) return
    try {
      await remove(String(activeClient.id))
      toast.success('Cliente eliminado correctamente')
      setIsDeleteOpen(false)
      refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar el cliente')
    }
  }

  return (
    <main className="space-y-8">
      <Toaster position="top-right" />

      <PageHeader
        eyebrow="Gestión de clientes"
        title="Clientes"
        description="Administra los clientes registrados en la entidad financiera desde un panel seguro y profesional."
        actions={<Button onClick={openCreate}><Plus className="h-4 w-4" />Nuevo cliente</Button>}
      />

      <Section title="Operaciones y consulta" description="Consulta, filtra y gestiona clientes con una experiencia uniforme en todo el sistema.">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por nombre, apellido o identificación"
            ariaLabel="Buscar clientes"
          />
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
