import React from 'react'

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
}

export function Select({ label, className = '', children, ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      <select
        className={`mt-2 block w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
