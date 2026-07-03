"use client";

import Link from "next/link";
import {
  Activity,
  Briefcase,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Clientes",
    href: "/dashboard/clientes",
    icon: Users,
  },
  {
    label: "Productos",
    href: "/dashboard/cuentas",
    icon: Wallet,
  },
  {
    label: "Transacciones",
    href: "/dashboard/transacciones",
    icon: Activity,
  },
  {
    label: "Reportes",
    href: "/dashboard/reportes",
    icon: Briefcase,
  },
  {
    label: "Configuración",
    href: "/dashboard/configuracion",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname() || "/dashboard";

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-80 border-r border-slate-200 bg-white lg:flex lg:flex-col">

      {/* Logo */}
      <div className="border-b border-slate-200 px-8 py-8">
        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/20">
            <Wallet className="h-7 w-7" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Digital Banking
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              NovaBank
            </h2>
          </div>

        </div>
      </div>

      {/* Navegación */}
      <div className="flex-1 overflow-y-auto px-5 py-8">

        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.30em] text-slate-400">
          Menú principal
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200

                ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }
                
                `}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-900"
                  }`}
                />

                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Estado */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-5">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Sistema Seguro
              </p>

              <p className="text-sm text-slate-500">
                Todos los servicios activos
              </p>
            </div>

          </div>

          <div className="mt-5">

            <div className="mb-2 flex items-center justify-between text-sm">

              <span className="text-slate-500">
                Disponibilidad
              </span>

              <span className="font-semibold text-slate-900">
                99.9%
              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">

              <div className="h-full w-[99%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />

            </div>

          </div>

        </div>
      </div>

      {/* Usuario */}
      <div className="border-t border-slate-200 p-6">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-lg font-semibold text-white">
            LG
          </div>

          <div className="flex-1">

            <h3 className="font-semibold text-slate-900">
              Laura Gómez
            </h3>

            <p className="text-sm text-slate-500">
              Administrador
            </p>

          </div>

        </div>

        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">

          <LogOut className="h-4 w-4" />

          Cerrar sesión

        </button>

      </div>

    </aside>
  );
}