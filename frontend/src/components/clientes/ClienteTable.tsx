"use client"
import React from 'react'
import { Cliente } from '../../types/cliente'

type Props = {
  data?: Cliente[]
  loading?: boolean
  onEdit?: (c: Cliente) => void
  onDelete?: (id: string) => void
}

export function ClienteTable({ data = [], loading, onEdit, onDelete }: Props) {
  if (loading) return <div className="p-4">Cargando...</div>
  if (!data || data.length === 0) return <div className="p-4">No hay clientes</div>

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Tipo Identificación</th>
            <th className="px-4 py-2 text-left">Número Identificación</th>
            <th className="px-4 py-2 text-left">Nombres</th>
            <th className="px-4 py-2 text-left">Apellidos</th>
            <th className="px-4 py-2 text-left">Correo</th>
            <th className="px-4 py-2 text-left">Fecha Nacimiento</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {data.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-2">{c.tipoIdentificacion}</td>
              <td className="px-4 py-2">{c.numeroIdentificacion}</td>
              <td className="px-4 py-2">{c.nombres}</td>
              <td className="px-4 py-2">{c.apellidos}</td>
              <td className="px-4 py-2">{c.correoElectronico}</td>
              <td className="px-4 py-2">{new Date(c.fechaNacimiento).toLocaleDateString()}</td>
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
    </div>
  )
}
