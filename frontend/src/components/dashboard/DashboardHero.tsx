"use client";

import { ArrowRight, Landmark, Plus, Users } from "lucide-react";
import Link from "next/link";

export function DashboardHero() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Buenos días"
      : hour < 19
      ? "Buenas tardes"
      : "Buenas noches";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* Fondo decorativo */}
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

        {/* Texto */}
        <div className="max-w-2xl">

          <p className="text-sm font-medium text-blue-600">
            {greeting} 👋
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Bienvenido al Panel Financiero
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Administra clientes, productos financieros y transacciones
            desde un único lugar con información actualizada en tiempo real.
          </p>

          <div className="mt-8 flex items-center gap-3">

            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2">

              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <span className="text-sm font-medium text-emerald-700">
                Backend conectado
              </span>

            </div>

            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
              Datos sincronizados
            </div>

          </div>

        </div>

        {/* Acciones rápidas */}
        <div className="grid w-full max-w-sm gap-4">

          <Link
            href="/dashboard/clientes"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-500 hover:bg-white hover:shadow-md"
          >

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Users size={22} />
              </div>

              <div>

                <p className="font-semibold text-slate-900">
                  Nuevo Cliente
                </p>

                <p className="text-sm text-slate-500">
                  Registrar un cliente
                </p>

              </div>

            </div>

            <ArrowRight className="text-slate-400 group-hover:text-blue-600" />

          </Link>

          <Link
            href="/dashboard/cuentas"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-500 hover:bg-white hover:shadow-md"
          >

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                <Landmark size={22} />
              </div>

              <div>

                <p className="font-semibold text-slate-900">
                  Crear Cuenta
                </p>

                <p className="text-sm text-slate-500">
                  Abrir un producto financiero
                </p>

              </div>

            </div>

            <Plus className="text-slate-400 group-hover:text-emerald-600" />

          </Link>

        </div>

      </div>

    </section>
  );
}