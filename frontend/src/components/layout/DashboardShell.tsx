"use client";

import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "../navigation/Sidebar";

type Props = {
  children: ReactNode;
};

export function DashboardShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Contenido */}
        <div className="flex flex-1 flex-col lg:ml-80">

          {/* Header */}
          <Header />

          {/* Fondo decorativo */}
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-44 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          </div>

          {/* Contenido */}
          <main className="flex-1 px-6 py-8 lg:px-10">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-4 text-sm text-slate-500">
              <span>© 2026 NovaBank Admin</span>

              <div className="flex items-center gap-6">
                <span>Sistema Financiero</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}