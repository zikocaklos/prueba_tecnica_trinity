import { Component, effect, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

const sections: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/clientes': 'Clientes',
  '/cuentas': 'Productos',
  '/transacciones': 'Transacciones',
};

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div class="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
        <div>
          <p class="text-sm text-slate-500">{{ greeting }},</p>
          <h1 class="mt-1 text-3xl font-bold tracking-tight text-slate-900">{{ sectionTitle }}</h1>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  sectionTitle = '';
  greeting = '';

  constructor(private router: Router) {
    this.updateGreeting();
    this.updateRoute(router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateRoute(event.urlAfterRedirects);
    });
  }

  private updateRoute(url: string) {
    const path = url.split('?')[0];
    this.sectionTitle = sections[path] || 'Dashboard';
  }

  private updateGreeting() {
    const hour = new Date().getHours();
    this.greeting = hour < 12 ? 'Buenos d\u00edas' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  }
}
