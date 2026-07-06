import { useState } from 'react'
import { Eye, Edit3, Trash2, ChevronDown } from 'lucide-react'
import { Client } from '../../types/client'
import { calculateAge, getClientFullName } from '../../lib/client-utils'

type Props = {
  data: Client[]
  loading?: boolean
  onView: (client: Client) => void
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
}

export function ClientTable({ data, loading, onView, onEdit, onDelete }: Props) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 w-3/5 rounded-md bg-slate-200" />
            <div className="mt-6 space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="grid grid-cols-7 gap-4 py-4">
                  <div className="col-span-1 h-6 rounded-md bg-slate-200" />
                  <div className="col-span-1 h-6 rounded-md bg-slate-200" />
                  <div className="col-span-1 h-6 rounded-md bg-slate-200" />
                  <div className="col-span-1 h-6 rounded-md bg-slate-200" />
                  <div className="col-span-1 h-6 rounded-md bg-slate-200" />
                  <div className="col-span-1 h-6 rounded-md bg-slate-200" />
                  <div className="col-span-1 h-6 rounded-md bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
        <p className="text-lg font-semibold">No se encontraron clientes</p>
        <p className="mt-2 text-sm">Registra un cliente para comenzar a gestionar la cartera.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-2 bg-slate-50 p-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 sm:grid-cols-[220px_220px_1fr_180px_180px_140px]">
        <span>Tipo doc.</span>
        <span>Número doc.</span>
        <span>Nombre completo</span>
        <span>Correo</span>
        <span>Edad</span>
        <span className="text-right">Acciones</span>
      </div>
      <div className="space-y-3 p-4">
        {data.map((client) => (
          <div key={client.id} className="grid gap-2 rounded-[26px] border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:grid-cols-[220px_220px_1fr_180px_180px_140px] sm:items-center">
            <span className="font-medium text-slate-900">{client.identificationType}</span>
            <span>{client.identificationNumber}</span>
            <span>{getClientFullName(client)}</span>
            <span>{client.email}</span>
            <span>{calculateAge(client.birthDate) ?? 'N/D'} años</span>
            <div className="relative mt-4 flex items-center justify-end gap-2 sm:mt-0">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700"
                onClick={() => setOpenMenuId(openMenuId === client.id ? null : client.id)}
              >
                Acciones
                <ChevronDown className="h-4 w-4" />
              </button>
              {openMenuId === client.id && (
                <div className="absolute right-0 z-10 mt-14 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={() => { onView(client); setOpenMenuId(null) }}>
                    <Eye className="h-4 w-4" /> Ver detalle
                  </button>
                  <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={() => { onEdit(client); setOpenMenuId(null) }}>
                    <Edit3 className="h-4 w-4" /> Editar
                  </button>
                  <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-slate-50" onClick={() => { onDelete(client); setOpenMenuId(null) }}>
                    <Trash2 className="h-4 w-4" /> Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
        