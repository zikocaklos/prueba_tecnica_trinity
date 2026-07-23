import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900">
      <div class="flex min-h-screen">
        <app-sidebar />
        <div class="flex flex-1 flex-col lg:ml-80">
          <app-header />
          <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div class="absolute -top-44 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div class="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"></div>
          </div>
          <main class="flex-1 px-6 py-8 lg:px-10">
            <div class="mx-auto max-w-7xl">
              <router-outlet />
            </div>
          </main>
          <footer class="border-t border-slate-200 bg-white/70 backdrop-blur-xl">
            <div class="mx-auto flex max-w-7xl items-center justify-between px-10 py-4 text-sm text-slate-500">
              <span>&copy; 2026 NovaBank Admin</span>
              <div class="flex items-center gap-6">
                <span>Sistema Financiero</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  `,
})
export class LayoutComponent {}
