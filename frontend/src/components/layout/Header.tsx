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

      </div>
    </header>
  );
}