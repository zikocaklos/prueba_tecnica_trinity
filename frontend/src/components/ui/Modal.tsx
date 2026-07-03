import React from 'react'
import { X } from 'lucide-react'

export function Modal({ open, onClose, children, title, size = 'md' }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string; size?: 'sm' | 'md' | 'lg' }) {
  if (!open) return null

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  }[size]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className={`relative w-full ${sizeClass} overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_90px_-25px_rgba(15,23,42,0.45)] sm:p-8`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
        {title && <h3 className="pr-10 text-xl font-semibold text-slate-950">{title}</h3>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
