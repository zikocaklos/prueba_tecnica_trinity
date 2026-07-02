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
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Tipo Identificación</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Número Identificación</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Nombre Completo</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Correo Electrónico</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Fecha Nacimiento</th>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Fecha Creación</th>
            <th className="px-4 py-4 text-right text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.map((client) => (
            <tr key={client.id} className="hover:bg-slate-50">
              <td className="px-4 py-4 text-sm text-slate-700">{client.identificationType}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{client.identificationNumber}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{`${client.firstName} ${client.lastName}`}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{client.email}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{new Date(client.birthDate).toLocaleDateString('es-ES')}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{new Date(client.createdAt).toLocaleDateString('es-ES')}</td>
              <td className="px-4 py-4 text-right text-sm text-slate-700">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    aria-label="Ver detalles"
                    onClick={() => onView(client)}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    aria-label="Editar cliente"
                    onClick={() => onEdit(client)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-red-600 transition hover:border-red-300 hover:text-red-800"
                    aria-label="Eliminar cliente"
                    onClick={() => onDelete(client)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
