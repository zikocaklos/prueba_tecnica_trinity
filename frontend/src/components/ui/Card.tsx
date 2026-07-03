import React from 'react'

type Props = {
  title?: string
  description?: string
  className?: string
  children: React.ReactNode
}

export function Card({ title, description, className = '', children }: Props) {
  return (
    <section className={`rounded-2xl border border-brand-border bg-white p-6 shadow-soft ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-lg font-semibold text-slate-950">{title}</h2>}
          {description && <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
