import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/clients/clients.component').then(m => m.ClientsComponent),
      },
      {
        path: 'cuentas',
        loadComponent: () => import('./features/accounts/accounts.component').then(m => m.AccountsComponent),
      },
      {
        path: 'transacciones',
        loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent),
      },
    ],
  },
];
