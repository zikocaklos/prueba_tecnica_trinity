import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  loading?: boolean
}

const styles: Record<string, string> = {
  primary: 'bg-brand-primary text-white shadow-sm shadow-slate-950/10 hover:bg-slate-950',
  secondary: 'border border-brand-border bg-white text-slate-950 shadow-sm hover:bg-slate-50',
  outline: 'border border-slate-200 bg-transparent text-slate-950 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  danger: 'bg-brand-danger text-white shadow-sm shadow-red-950/10 hover:bg-[#dc2626]',
  success: 'bg-brand-success text-white shadow-sm shadow-emerald-950/10 hover:bg-[#16a34a]',
}

export function Button({ variant = 'primary', loading = false, className = '', disabled, children, ...props }: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${styles[variant]} ${className}`}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </button>
  )
}
