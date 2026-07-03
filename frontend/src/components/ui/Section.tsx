import type { ReactNode } from 'react'

type SectionProps = {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function Section({ title, description, children, className = '' }: SectionProps) {
  return (
    <section className={`rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.2)] backdrop-blur-xl ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-lg font-semibold text-slate-950">{title}</h2>}
          {description && <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
