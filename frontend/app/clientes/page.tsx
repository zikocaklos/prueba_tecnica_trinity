"use client"
import React, { useState } from 'react'
import { useClientes } from '../../src/hooks/useClientes'
import { Button } from '../../src/components/ui/Button'
import { ClienteModal } from '../../src/components/clientes/ClienteModal'
import { ClienteForm } from '../../src/components/clientes/ClienteForm'
import { ClienteTable } from '../../src/components/clientes/ClienteTable'
import { ClienteDeleteDialog } from '../../src/components/clientes/ClienteDeleteDialog'
import { Toaster, toast } from 'sonner'

export default function ClientesPage() {
  const { clientes, isLoading, refresh, create, update, remove } = useClientes()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [deleting, setDeleting] = useState<{ open: boolean; id?: string; name?: string }>({ open: false })

  const openCreate = () => { setEditing(null); setOpen(true) }
  const openEdit = (c: any) => { setEditing(c); setOpen(true) }

  const handleSubmit = async (dataForm: any) => {
    try {
      if (editing?.id) {
        await update(editing.id, dataForm)
        toast.success('Cliente actualizado')
      } else {
        await create(dataForm)
        toast.success('Cliente creado')
      }
      setOpen(false)
    } catch (err: any) {
      toast.error(err?.message || 'Error al guardar')
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    try {
      await remove(id)
      toast.success('Cliente eliminado')
      setDeleting({ open: false })
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar')
    }
  }

  return (
    <main className="container py-8">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <div>
          <Button onClick={openCreate}>Nuevo cliente</Button>
        </div>
      </div>

      <ClienteTable data={clientes} loading={isLoading} onEdit={openEdit} onDelete={(id) => setDeleting({ open: true, id })} />

      <ClienteModal open={open} onClose={() => setOpen(false)} title={editing ? 'Editar cliente' : 'Nuevo cliente'}>
        <ClienteForm defaultValues={editing} onSubmit={handleSubmit} />
      </ClienteModal>

      <ClienteDeleteDialog open={deleting.open} onCancel={() => setDeleting({ open: false })} onConfirm={() => handleDelete(deleting.id)} />
    </main>
  )
}
