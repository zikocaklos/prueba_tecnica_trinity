import React from 'react'
import { Cliente } from '../../types'
import { Badge } from '../ui/Badge'

type Props = {
  data: Cliente[]
  onEdit?: (c: Cliente) => void
  onDelete?: (id: string) => void
}

export function ClientTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Nombres</th>
            <th className="px-4 py-2 text-left">Apellidos</th>
            <th className="px-4 py-2 text-left">Correo</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-2">{c.numeroIdentificacion}</td>
              <td className="px-4 py-2">{c.nombres}</td>
              <td className="px-4 py-2">{c.apellidos}</td>
              <td className="px-4 py-2">{c.correoElectronico}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button className="text-indigo-600" onClick={() => onEdit?.(c)}>Editar</button>
                  <button className="text-red-600" onClick={() => onDelete?.(c.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <div className="p-4">No hay clientes</div>}
    </div>
  )
}
