import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="fixed left-0 top-0 hidden h-screen w-80 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div class="border-b border-slate-200 px-8 py-8">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Digital Banking</p>
            <h2 class="mt-1 text-2xl font-bold text-slate-900">NovaBank</h2>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-8">
        <p class="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.30em] text-slate-400">Men&uacute; principal</p>
        <nav class="space-y-2">
          @for (item of navigation; track item.href) {
            <a
              [routerLink]="item.href"
              routerLinkActive="bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              [routerLinkActiveOptions]="{ exact: item.href === '/dashboard' }"
              class="group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <span [innerHTML]="item.icon" class="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5"></span>
              <span class="font-medium">{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-emerald-100 p-2 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <p class="font-semibold text-slate-900">Sistema Seguro</p>
              <p class="text-sm text-slate-500">Todos los servicios activos</p>
            </div>
          </div>
          <div class="mt-5">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="text-slate-500">Disponibilidad</span>
              <span class="font-semibold text-slate-900">99.9%</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-slate-200">
              <div class="h-full w-[99%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  readonly navigation: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>' },
    { label: 'Clientes', href: '/clientes', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { label: 'Productos', href: '/cuentas', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>' },
    { label: 'Transacciones', href: '/transacciones', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' },
  ];
}
