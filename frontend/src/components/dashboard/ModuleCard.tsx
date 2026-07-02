import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

type ModuleCardProps = {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

export function ModuleCard({ icon: Icon, title, description, href }: ModuleCardProps) {
  return (
    <Link href={href} className="group block rounded-[28px] border border-slate-200 bg-slate-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-900">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800 text-slate-200 transition duration-300 group-hover:bg-slate-700">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">{description}</p>
      </div>
      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition group-hover:text-sky-300">
        Ingresar
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  )
}
