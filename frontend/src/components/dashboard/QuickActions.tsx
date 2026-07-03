"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  Download,
  Landmark,
  Users,
} from "lucide-react";

const actions = [
  {
    title: "Nuevo cliente",
    description: "Registrar un cliente",
    href: "/dashboard/clientes",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Nueva cuenta",
    description: "Abrir una cuenta",
    href: "/dashboard/cuentas",
    icon: Landmark,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Transferencia",
    description: "Registrar movimiento",
    href: "/dashboard/transacciones",
    icon: ArrowLeftRight,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Exportar",
    description: "Descargar reporte",
    href: "#",
    icon: Download,
    color: "bg-amber-100 text-amber-600",
  },
];

export function QuickActions() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-xl font-bold text-slate-900">
        Acciones rápidas
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Accesos directos del sistema
      </p>

      <div className="mt-8 space-y-4">

        {actions.map((action) => {

          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition-all hover:border-blue-200 hover:bg-slate-50 hover:shadow-md"
            >

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-slate-900">
                  {action.title}
                </h3>

                <p className="text-sm text-slate-500">
                  {action.description}
                </p>

              </div>

            </Link>
          );

        })}

      </div>

    </section>
  );
}