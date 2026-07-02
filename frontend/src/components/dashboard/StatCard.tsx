import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  icon: LucideIcon
  title: string
  value: string
  accentClass: string
}

export function StatCard({ icon: Icon, title, value, accentClass }: StatCardProps) {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className={`mb-5 inline-flex rounded-2xl bg-slate-50 p-3 ${accentClass}`}>
        <Icon className="h-6 w-6 text-slate-700" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{title}</p>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
    </article>
  )
}
