import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ClientService } from '../../core/services/client.service';
import { AccountService } from '../../core/services/account.service';
import { TransactionService } from '../../core/services/transaction.service';
import { Client } from '../../core/models/client.model';
import { Account } from '../../core/models/account.model';
import { Transaction } from '../../core/models/transaction.model';

interface ActivityItem {
  type: 'CLIENT' | 'ACCOUNT' | 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  title: string;
  description: string;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  clients = signal<Client[]>([]);
  accounts = signal<Account[]>([]);
  transactions = signal<Transaction[]>([]);
  loading = signal(true);
  greeting = '';

  readonly stats = computed(() => [
    { title: 'Clientes', value: this.loading() ? '...' : String(this.clients().length), subtitle: 'Clientes registrados', accentClass: 'bg-blue-100 text-blue-600' },
    { title: 'Productos', value: this.loading() ? '...' : String(this.accounts().length), subtitle: 'Cuentas activas', accentClass: 'bg-emerald-100 text-emerald-600' },
    { title: 'Transacciones', value: this.loading() ? '...' : String(this.transactions().length), subtitle: 'Operaciones realizadas', accentClass: 'bg-violet-100 text-violet-600' },
  ]);

  readonly activities = computed<ActivityItem[]>(() => {
    const items: ActivityItem[] = [
      ...this.clients().map(c => ({ type: 'CLIENT' as const, title: 'Nuevo cliente registrado', description: `${c.firstName} ${c.lastName}`, date: new Date(c.createdAt) })),
      ...this.accounts().map(a => ({ type: 'ACCOUNT' as const, title: 'Cuenta creada', description: a.accountType === 'SAVINGS' ? 'Cuenta de Ahorros' : 'Cuenta Corriente', date: new Date(a.createdAt) })),
      ...this.transactions().map(t => ({
        type: (t.type === 'DEPOSIT' ? 'DEPOSIT' : t.type === 'WITHDRAWAL' ? 'WITHDRAW' : 'TRANSFER') as ActivityItem['type'],
        title: t.type === 'TRANSFER' ? 'Transferencia realizada' : t.type === 'DEPOSIT' ? 'Depósito realizado' : 'Retiro realizado',
        description: `$${Number(t.amount).toLocaleString('es-CO')}`,
        date: new Date(t.transactionDate),
      })),
    ];
    return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 6);
  });

  constructor(
    private clientService: ClientService,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {
    const hour = new Date().getHours();
    this.greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  }

  ngOnInit() {
    this.clientService.list().subscribe({ next: (d) => { this.clients.set(d); this.checkLoading(); }, error: () => this.checkLoading() });
    this.accountService.list().subscribe({ next: (d) => { this.accounts.set(d); this.checkLoading(); }, error: () => this.checkLoading() });
    this.transactionService.list().subscribe({ next: (d) => { this.transactions.set(d); this.checkLoading(); }, error: () => this.checkLoading() });
  }

  private loadedCount = 0;
  private checkLoading() {
    this.loadedCount++;
    if (this.loadedCount >= 3) this.loading.set(false);
  }

  timeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) return 'hace unos segundos';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return `hace ${days} d`;
  }
}
