"use client"

import { Button } from '../ui/Button'

type Props = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function AccountDeleteDialog({ open, onConfirm, onCancel }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/50" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-slate-950">¿Está seguro de eliminar esta cuenta?</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">La cuenta se eliminará permanentemente del sistema.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm}>Eliminar</Button>
        </div>
      </div>
    </div>
  )
}
