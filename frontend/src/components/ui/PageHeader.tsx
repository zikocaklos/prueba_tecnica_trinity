import type { ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions, children }: PageHeaderProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-brand-border bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{eyebrow}</p>}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
      {children}
    </div>
  )
}
