import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center text-slate-600">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      {description && <p className="mt-2 text-sm leading-6">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}
