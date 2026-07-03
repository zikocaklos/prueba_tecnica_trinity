"use client";

import {
  Bell,
  Search,
  Settings,
  User,
  ChevronDown,
} from "lucide-react";
import { usePathname } from "next/navigation";

const sections: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/clientes": "Clientes",
  "/dashboard/cuentas": "Productos",
  "/dashboard/transacciones": "Transacciones",
  "/dashboard/reportes": "Reportes",
  "/dashboard/configuracion": "Configuración",
};

export function Header() {
  const pathname = usePathname() || "/dashboard";

  const sectionTitle = sections[pathname] || "Dashboard";

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Buenos días"
      : hour < 19
      ? "Buenas tardes"
      : "Buenas noches";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">

        {/* Lado izquierdo */}
        <div>

          <p className="text-sm text-slate-500">
            {greeting},
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {sectionTitle}
          </h1>

        </div>

        {/* Centro */}
        <div className="hidden xl:flex">

          <div className="flex w-[420px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg">

            <Search className="h-5 w-5 text-slate-400" />

            <input
              type="text"
              placeholder="Buscar clientes, cuentas o transacciones..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />

          </div>

        </div>

        {/* Derecha */}
        <div className="flex items-center gap-3">

          <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white transition hover:bg-slate-100">

            <Bell className="h-5 w-5 text-slate-600" />

          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white transition hover:bg-slate-100">

            <Settings className="h-5 w-5 text-slate-600" />

          </button>

          <div className="ml-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white font-semibold">

              LG

            </div>

            <div className="hidden lg:block">

              <p className="text-sm font-semibold text-slate-900">
                Laura Gómez
              </p>

              <p className="text-xs text-slate-500">
                Administrador
              </p>

            </div>

            <ChevronDown className="h-4 w-4 text-slate-400" />

          </div>

        </div>

      </div>
    </header>
  );
}