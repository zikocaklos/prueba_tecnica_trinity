"use client"

import { AlertTriangle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

type Props = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  name?: string
}

export function ClientDeleteDialog({ open, onConfirm, onCancel, name }: Props) {
  return (
    <Modal open={open} onClose={onCancel} title="Eliminar cliente" size="sm">
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>Esta acción eliminará permanentemente al cliente {name ? `"${name}"` : 'seleccionado'} del sistema.</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm}>Eliminar</Button>
        </div>
      </div>
    </Modal>
  )
}
