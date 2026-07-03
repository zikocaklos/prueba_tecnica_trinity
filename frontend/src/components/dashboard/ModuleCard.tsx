import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

type ModuleCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

export function ModuleCard({
  icon: Icon,
  title,
  description,
  href,
}: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      {/* Fondo decorativo */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl transition-all duration-500 group-hover:bg-blue-500/10" />

      <div className="relative">

        {/* Badge */}
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Módulo
        </span>

        {/* Icono */}
        <div className="mt-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-8 w-8" />
        </div>

        {/* Información */}
        <div className="mt-6">

          <h3 className="text-xl font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {description}
          </p>

        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">

          <span className="text-sm font-semibold text-blue-600">
            Abrir módulo
          </span>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">

            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />

          </div>

        </div>

      </div>
    </Link>
  );
}