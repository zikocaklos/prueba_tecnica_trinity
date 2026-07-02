export function DashboardHero() {
  return (
    <section className="rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-xl shadow-slate-900/10 sm:p-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Panel administrativo</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Sistema de Gestión Bancaria</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
          Administra clientes, productos financieros y movimientos transaccionales desde una sola plataforma.
        </p>
      </div>
    </section>
  )
}
