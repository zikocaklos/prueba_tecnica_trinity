import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  accentClass: string;
  subtitle?: string;
};

export function StatCard({
  icon: Icon,
  title,
  value,
  accentClass,
  subtitle,
}: StatCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

      {/* Fondo */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl transition group-hover:bg-blue-500/10" />

      <div className="relative">

        {/* Cabecera */}
        <div className="flex items-start justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.30em] text-slate-400">
              {title}
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              {value}
            </h2>

          </div>

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accentClass}`}
          >
            <Icon className="h-7 w-7" />
          </div>

        </div>

        {/* Descripción */}
        {subtitle && (
          <p className="mt-5 text-sm leading-6 text-slate-500">
            {subtitle}
          </p>
        )}

        {/* Línea inferior */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">

          <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1">

            <TrendingUp className="h-4 w-4 text-emerald-600" />

            <span className="text-xs font-semibold text-emerald-700">
              Activo
            </span>

          </div>

          <span className="text-xs text-slate-400">
            Actualizado ahora
          </span>

        </div>

      </div>

    </article>
  );
}