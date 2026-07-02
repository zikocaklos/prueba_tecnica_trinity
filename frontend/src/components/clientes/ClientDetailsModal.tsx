"use client"

import { Client } from '../../types/client'
import { Modal } from '../ui/Modal'

type Props = {
  open: boolean
  onClose: () => void
  client: Client | null
}

export function ClientDetailsModal({ open, onClose, client }: Props) {
  if (!client) return null

  return (
    <Modal open={open} onClose={onClose} title="Detalle del cliente">
      <div className="space-y-5 text-sm text-slate-700">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Tipo de identificación</p>
            <p className="mt-2 font-medium text-slate-900">{client.identificationType}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Número de identificación</p>
            <p className="mt-2 font-medium text-slate-900">{client.identificationNumber}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Nombres</p>
            <p className="mt-2 font-medium text-slate-900">{client.firstName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Apellidos</p>
            <p className="mt-2 font-medium text-slate-900">{client.lastName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Correo electrónico</p>
            <p className="mt-2 font-medium text-slate-900">{client.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Fecha de nacimiento</p>
            <p className="mt-2 font-medium text-slate-900">{new Date(client.birthDate).toLocaleDateString('es-ES')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Fecha de creación</p>
            <p className="mt-2 font-medium text-slate-900">{new Date(client.createdAt).toLocaleString('es-ES')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Última actualización</p>
            <p className="mt-2 font-medium text-slate-900">{new Date(client.updatedAt).toLocaleString('es-ES')}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
