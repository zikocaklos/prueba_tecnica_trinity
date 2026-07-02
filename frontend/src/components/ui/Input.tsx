import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string }

export function Input({ label, className = '', ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      <input className={`mt-1 block w-full rounded-md border px-3 py-2 ${className}`} {...props} />
    </label>
  )
}
