import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TransactionService } from '../../core/services/transaction.service';
import { AccountService } from '../../core/services/account.service';
import { Transaction, TransactionRequest, TransactionType } from '../../core/models/transaction.model';
import { Account } from '../../core/models/account.model';
import { ButtonComponent } from '../../shared/components/button.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { SearchBarComponent } from '../../shared/components/search-bar.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [FormsModule, DatePipe, ButtonComponent, ModalComponent, EmptyStateComponent, LoadingSpinnerComponent, SearchBarComponent],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  accounts = signal<Account[]>([]);
  isLoading = signal(true);
  error = signal(false);
  searchQuery = signal('');
  typeFilter = signal<'ALL' | TransactionType>('ALL');
  isModalOpen = false;
  isDetailsOpen = false;
  activeTransaction: Transaction | null = null;
  submitting = false;

  // Form fields
  formType: TransactionType = 'DEPOSIT';
  formSourceAccountId = '';
  formDestinationAccountId = '';
  formAmount = 0;
  formErrors: Record<string, string> = {};

  readonly transactionTypeFilters: ('ALL' | TransactionType)[] = ['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'];
  readonly transactionTypeOptions = [
    { value: 'DEPOSIT', label: 'Consignaci\u00f3n' },
    { value: 'WITHDRAWAL', label: 'Retiro' },
    { value: 'TRANSFER', label: 'Transferencia' },
  ];

  usableAccounts = computed(() => this.accounts().filter(a => a.status === 'ACTIVE' && !a.deleted));

  filteredTransactions = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    return this.transactions().filter(t => {
      const matchType = this.typeFilter() === 'ALL' || t.type === this.typeFilter();
      const matchSearch = !query ||
        [String(t.id), t.type, t.sourceAccount?.accountNumber, t.destinationAccount?.accountNumber]
          .filter(Boolean).join(' ').toLowerCase().includes(query);
      return matchType && matchSearch;
    });
  });

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.isLoading.set(true);
    this.error.set(false);
    this.transactionService.list().subscribe({
      next: (data) => {
        const enriched = this.accounts().length > 0 ? this.enrichTransactions(data) : data;
        this.transactions.set(enriched);
        this.isLoading.set(false);
      },
      error: () => { this.isLoading.set(false); this.error.set(true); },
    });
    this.accountService.list().subscribe({
      next: (data) => {
        this.accounts.set(data);
        if (this.transactions().length > 0) {
          this.transactions.update(() => this.enrichTransactions(this.transactions()));
        }
      },
      error: () => {},
    });
  }

  private enrichTransactions(txs: Transaction[]): Transaction[] {
    const accounts = this.accounts();
    if (accounts.length === 0) return txs;
    const accountMap = new Map(accounts.map(a => [a.id, a]));
    return txs.map(t => ({
      ...t,
      sourceAccount: t.sourceAccount?.id != null ? (accountMap.get(t.sourceAccount.id) ?? t.sourceAccount) : null,
      destinationAccount: t.destinationAccount?.id != null ? (accountMap.get(t.destinationAccount.id) ?? t.destinationAccount) : null,
    }));
  }

  openCreate() {
    this.resetForm();
    this.isModalOpen = true;
  }

  openDetails(transaction: Transaction) {
    this.activeTransaction = transaction;
    this.isDetailsOpen = true;
  }

  private resetForm() {
    this.formType = 'DEPOSIT';
    this.formSourceAccountId = '';
    this.formDestinationAccountId = '';
    this.formAmount = 0;
    this.formErrors = {};
  }

  validateForm(): boolean {
    this.formErrors = {};
    if (!this.formType) this.formErrors['type'] = 'Tipo de transacci\u00f3n es requerido';
    if (isNaN(this.formAmount) || this.formAmount <= 0) this.formErrors['amount'] = 'Monto debe ser mayor que cero';

    if (this.formType === 'DEPOSIT' && !this.formDestinationAccountId) {
      this.formErrors['destinationAccountId'] = 'Cuenta destino es requerida para consignaci\u00f3n';
    }
    if (this.formType === 'WITHDRAWAL' && !this.formSourceAccountId) {
      this.formErrors['sourceAccountId'] = 'Cuenta origen es requerida para retiro';
    }
    if (this.formType === 'TRANSFER') {
      if (!this.formSourceAccountId) this.formErrors['sourceAccountId'] = 'Cuenta origen es requerida para transferencia';
      if (!this.formDestinationAccountId) this.formErrors['destinationAccountId'] = 'Cuenta destino es requerida para transferencia';
      if (this.formSourceAccountId && this.formDestinationAccountId && this.formSourceAccountId === this.formDestinationAccountId) {
        this.formErrors['destinationAccountId'] = 'Cuenta destino debe ser diferente a la cuenta origen';
      }
    }
    return Object.keys(this.formErrors).length === 0;
  }

  async handleCreateTransaction() {
    if (!this.validateForm()) return;
    this.submitting = true;

    const payload: TransactionRequest = {
      type: this.formType,
      amount: this.formAmount,
      sourceAccountId: this.formSourceAccountId ? Number(this.formSourceAccountId) : undefined,
      destinationAccountId: this.formDestinationAccountId ? Number(this.formDestinationAccountId) : undefined,
    };

    try {
      await this.transactionService.create(payload).toPromise();
      this.showToast('success', 'Transacci\u00f3n registrada correctamente');
      this.isModalOpen = false;
      this.loadData();
    } catch (err: any) {
      this.showToast('error', err?.message || 'Error al crear la transacci\u00f3n');
    } finally {
      this.submitting = false;
    }
  }

  private showToast(type: 'success' | 'error', message: string) {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3000);
  }

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  readonly badgeStyles: Record<TransactionType, string> = {
    DEPOSIT: 'bg-emerald-100 text-emerald-800',
    WITHDRAWAL: 'bg-red-100 text-red-800',
    TRANSFER: 'bg-sky-100 text-sky-800',
  };
}
