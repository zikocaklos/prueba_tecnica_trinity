import React from 'react'

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
}

export function Select({ label, className = '', children, ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      <select className={`mt-1 block w-full rounded-md border px-3 py-3 ${className}`} {...props}>
        {children}
      </select>
    </label>
  )
}
