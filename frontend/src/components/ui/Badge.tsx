import React from 'react'

type Props = {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
}

const map: Record<string, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-sky-100 text-sky-800',
  default: 'bg-slate-100 text-slate-800',
}

export function Badge({ children, variant = 'default' }: Props) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${map[variant]}`}>{children}</span>
}
