import { Eye, Edit3, Trash2 } from 'lucide-react'
import { Client } from '../../types/client'

type Props = {
  data: Client[]
  loading?: boolean
  onView: (client: Client) => void
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
}

export function ClientTable({ data, loading, onView, onEdit, onDelete }: Props) {
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
      <div className="grid gap-2 bg-slate-50 p-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 sm:grid-cols-[220px_220px_1fr_1fr_1fr_1fr]">
        <span>Tipo Identificación</span>
        <span>Número Identificación</span>
        <span>Nombre Completo</span>
        <span>Correo</span>
        <span>Fecha Nacimiento</span>
        <span className="text-right">Acciones</span>
      </div>
      <div className="space-y-3 p-4">
        {data.map((client) => (
          <div key={client.id} className="grid gap-2 rounded-[26px] border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:grid-cols-[220px_220px_1fr_1fr_1fr] sm:items-center">
            <span className="font-medium text-slate-900">{client.identificationType}</span>
            <span>{client.identificationNumber}</span>
            <span>{`${client.firstName} ${client.lastName}`}</span>
            <span>{client.email}</span>
            <span>{new Date(client.birthDate).toLocaleDateString('es-ES')}</span>
            <div className="mt-4 flex items-center justify-between gap-2 sm:mt-0 sm:justify-end">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                aria-label="Ver detalles"
                onClick={() => onView(client)}
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[#1D4ED8] transition hover:border-[#1D4ED8] hover:bg-sky-50"
                aria-label="Editar cliente"
                onClick={() => onEdit(client)}
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:border-red-300 hover:bg-red-100"
                aria-label="Eliminar cliente"
                onClick={() => onDelete(client)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
        