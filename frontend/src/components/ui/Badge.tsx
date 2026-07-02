import React from 'react'

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'default' }) {
  const map: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    default: 'bg-slate-100 text-slate-800',
  }
  return <span className={`px-2 py-1 rounded text-xs font-medium ${map[variant]}`}>{children}</span>
}
