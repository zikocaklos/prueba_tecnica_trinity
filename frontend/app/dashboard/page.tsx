import { ArrowLeftRight, Landmark, Users } from 'lucide-react'
import { DashboardHero } from '../../src/components/dashboard/DashboardHero'
import { StatCard } from '../../src/components/dashboard/StatCard'
import { ModuleCard } from '../../src/components/dashboard/ModuleCard'

const stats = [
  { title: 'Clientes registrados', value: '125', icon: Users, accentClass: 'bg-sky-100 text-sky-700' },
  { title: 'Cuentas activas', value: '340', icon: Landmark, accentClass: 'bg-emerald-100 text-emerald-700' },
  { title: 'Transacciones realizadas', value: '1,520', icon: ArrowLeftRight, accentClass: 'bg-violet-100 text-violet-700' },
]

const modules = [
  {
    title: 'Clientes',
    description: 'Administración completa de clientes, creación, edición, consulta y eliminación.',
    href: '/dashboard/clientes',
    icon: Users,
  },
  {
    title: 'Cuentas',
    description: 'Gestión de cuentas de ahorro y cuentas corrientes asociadas a clientes.',
    href: '/dashboard/cuentas',
    icon: Landmark,
  },
  {
    title: 'Transacciones',
    description: 'Registro de consignaciones, retiros y transferencias entre cuentas.',
    href: '/dashboard/transacciones',
    icon: ArrowLeftRight,
  },
]

export default function DashboardPage() {
  return (
    <main className="space-y-8 px-4 py-8 sm:px-6 lg:px-10">
      <DashboardHero />

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} accentClass={stat.accentClass} />
        ))}
      </section>

      <section>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Módulos</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Navegación rápida</h2>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.title} title={module.title} description={module.description} href={module.href} icon={module.icon} />
          ))}
        </div>
      </section>
    </main>
  )
}
