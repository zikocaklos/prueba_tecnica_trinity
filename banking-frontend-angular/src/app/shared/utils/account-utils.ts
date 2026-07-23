import { Account, AccountStatus, AccountType } from '../../core/models/account.model';

export function formatAccountType(accountType: AccountType): string {
  return accountType === 'SAVINGS' ? 'Ahorros' : 'Corriente';
}

export function formatAccountStatus(status: AccountStatus): string {
  switch (status) {
    case 'ACTIVE': return 'Activa';
    case 'INACTIVE': return 'Inactiva';
    case 'CANCELLED': return 'Cancelada';
    default: return 'Sin estado';
  }
}

export function getAccountStatusClasses(status: AccountStatus): string {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'INACTIVE': return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'CANCELLED': return 'bg-rose-50 text-rose-700 ring-rose-200';
    default: return 'bg-slate-100 text-slate-700 ring-slate-200';
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getBalanceStateLabel(balance: number): string {
  return balance > 0 ? 'Saldo disponible' : 'Saldo en cero';
}

export function getBalanceStateClasses(balance: number): string {
  return balance > 0 ? 'text-emerald-600' : 'text-slate-500';
}

export function canEditAccount(account: Account): boolean {
  return account.status !== 'CANCELLED';
}

export function canToggleAccount(account: Account): boolean {
  return account.status !== 'CANCELLED';
}

export function canDeleteAccount(account: Account): boolean {
  return account.status !== 'CANCELLED' && account.balance === 0;
}
