"use client"

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
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
    <main className="space-y-8 px-4 py-8 sm:px-6 lg:px-10">
      <Toaster position="top-right" />

      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">Gestión de Clientes</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Administra los clientes registrados en la entidad financiera</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Visualiza, edita y elimina clientes con seguridad y trazabilidad. Todas las operaciones se sincronizan con el backend real.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-96">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, apellido o número"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                aria-label="Buscar clientes"
              />
            </div>
            <Button onClick={openCreate}>Nuevo cliente</Button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <ClientTable
          data={filteredClients}
          loading={isLoading}
          onView={openDetails}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </section>

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
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Ocurrió un error al cargar los clientes. Por favor recarga la página o revisa la conexión con la API.
        </div>
      )}
    </main>
  )
}
