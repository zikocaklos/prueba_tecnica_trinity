"use client"
import React from 'react'
import { Button } from '../ui/Button'

type Props = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  name?: string
}

export function ClienteDeleteDialog({ open, onConfirm, onCancel, name }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-10 p-6">
        <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
        <p className="mb-4">¿Eliminar a {name ?? 'este cliente'}? Esta acción no se puede deshacer.</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm}>Eliminar</Button>
        </div>
      </div>
    </div>
  )
}
