import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AccountService } from '../../core/services/account.service';
import { ClientService } from '../../core/services/client.service';
import { Account, AccountRequest, AccountType, AccountStatus } from '../../core/models/account.model';
import { Client } from '../../core/models/client.model';
import { formatAccountType, formatCurrency, formatAccountStatus, getAccountStatusClasses, getBalanceStateClasses, getBalanceStateLabel, canEditAccount, canToggleAccount, canDeleteAccount } from '../../shared/utils/account-utils';
import { ButtonComponent } from '../../shared/components/button.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { SearchBarComponent } from '../../shared/components/search-bar.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [FormsModule, DatePipe, ButtonComponent, ModalComponent, EmptyStateComponent, LoadingSpinnerComponent, SearchBarComponent],
  templateUrl: './accounts.component.html',
})
export class AccountsComponent implements OnInit {
  accounts = signal<Account[]>([]);
  clients = signal<Client[]>([]);
  isLoading = signal(true);
  error = signal(false);
  searchQuery = signal('');
  typeFilter = signal<'ALL' | AccountType>('ALL');
  statusFilter = signal<'ALL' | AccountStatus>('ALL');
  isFormOpen = false;
  isDetailsOpen = false;
  isDeleteOpen = false;
  activeAccount: Account | null = null;
  formMode: 'create' | 'edit' = 'create';
  submitting = false;
  openMenuId: number | null = null;

  // Form fields
  formAccountNumber = '';
  formClientId = '';
  formAccountType: AccountType = 'SAVINGS';
  formBalance = 0;
  formExemptGmf = false;
  formStatus: AccountStatus = 'ACTIVE';
  formErrors: Record<string, string> = {};

  readonly typeFilterOptions: ('ALL' | AccountType)[] = ['ALL', 'SAVINGS', 'CHECKING'];
  readonly statusFilterOptions: ('ALL' | AccountStatus)[] = ['ALL', 'ACTIVE', 'INACTIVE', 'CANCELLED'];
  readonly typeOptions: { value: AccountType; label: string }[] = [
    { value: 'SAVINGS', label: 'Ahorros' },
    { value: 'CHECKING', label: 'Corriente' },
  ];
  readonly statusOptions: { value: AccountStatus; label: string }[] = [
    { value: 'ACTIVE', label: 'Activa' },
    { value: 'INACTIVE', label: 'Inactiva' },
    { value: 'CANCELLED', label: 'Cancelada' },
  ];

  visibleAccounts = computed(() => this.accounts().filter(a => !a.deleted));

  filteredAccounts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    return this.visibleAccounts().filter(account => {
      const matchSearch = [account.accountNumber, account.client.firstName, account.client.lastName, account.accountType].join(' ').toLowerCase().includes(query);
      const matchType = this.typeFilter() === 'ALL' || account.accountType === this.typeFilter();
      const matchStatus = this.statusFilter() === 'ALL' || account.status === this.statusFilter();
      return matchSearch && matchType && matchStatus;
    });
  });

  constructor(
    private accountService: AccountService,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.isLoading.set(true);
    this.error.set(false);
    this.accountService.list().subscribe({
      next: (data) => { this.accounts.set(data); this.isLoading.set(false); },
      error: () => { this.isLoading.set(false); this.error.set(true); },
    });
    this.clientService.list().subscribe({
      next: (data) => this.clients.set(data),
      error: () => {},
    });
  }

  toggleMenu(id: number) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  openCreate() {
    this.formMode = 'create';
    this.activeAccount = null;
    this.resetForm();
    this.formAccountType = 'SAVINGS';
    this.formBalance = 0;
    this.formExemptGmf = false;
    this.formStatus = 'ACTIVE';
    this.formAccountNumber = this.accountService.generateAccountNumber('SAVINGS', this.accounts());
    this.isFormOpen = true;
  }

  openEdit(account: Account) {
    if (account.status === 'CANCELLED') return;
    this.formMode = 'edit';
    this.activeAccount = account;
    this.formAccountNumber = account.accountNumber;
    this.formClientId = String(account.client.id);
    this.formAccountType = account.accountType;
    this.formBalance = account.balance;
    this.formExemptGmf = account.exemptGmf;
    this.formStatus = account.status;
    this.formErrors = {};
    this.isFormOpen = true;
  }

  openDetails(account: Account) {
    this.activeAccount = account;
    this.isDetailsOpen = true;
  }

  openDelete(account: Account) {
    if (account.balance > 0) {
      this.showToast('error', 'No es posible eliminar una cuenta con saldo disponible.');
      return;
    }
    if (!canDeleteAccount(account)) {
      this.showToast('error', 'No es posible eliminar una cuenta cancelada o con saldo disponible.');
      return;
    }
    this.activeAccount = account;
    this.isDeleteOpen = true;
  }

  onTypeChange() {
    if (this.formMode === 'create') {
      this.formAccountNumber = this.accountService.generateAccountNumber(this.formAccountType, this.accounts());
    }
  }

  private resetForm() {
    this.formAccountNumber = '';
    this.formClientId = '';
    this.formAccountType = 'SAVINGS';
    this.formBalance = 0;
    this.formExemptGmf = false;
    this.formStatus = 'ACTIVE';
    this.formErrors = {};
  }

  validateForm(): boolean {
    this.formErrors = {};
    if (!this.formClientId) this.formErrors['clientId'] = 'Cliente es requerido';
    if (!this.formAccountType) this.formErrors['accountType'] = 'Tipo de cuenta es requerido';
    if (isNaN(this.formBalance) || this.formBalance < 0) this.formErrors['balance'] = 'Saldo no puede ser negativo';
    return Object.keys(this.formErrors).length === 0;
  }

  async handleSubmit() {
    if (this.submitting || !this.validateForm()) return;
    this.submitting = true;
    try {
      if (this.formMode === 'edit' && this.activeAccount) {
        const payload: Partial<AccountRequest> = {
          accountNumber: this.formAccountNumber || this.activeAccount.accountNumber,
          clientId: Number(this.formClientId || this.activeAccount.client.id),
          accountType: this.formAccountType || this.activeAccount.accountType,
          balance: this.formBalance,
          exemptGmf: this.formExemptGmf,
          status: this.formStatus,
        };
        await this.accountService.update(this.activeAccount.id, payload).toPromise();
        this.showToast('success', 'Cuenta actualizada correctamente');
      } else {
        const payload: AccountRequest = {
          accountNumber: this.formAccountNumber,
          clientId: Number(this.formClientId),
          accountType: this.formAccountType,
          balance: this.formBalance,
          exemptGmf: this.formExemptGmf,
          status: 'ACTIVE',
        };
        await this.accountService.create(payload).toPromise();
        this.showToast('success', 'Cuenta creada correctamente');
      }
      this.isFormOpen = false;
      this.loadData();
    } catch (err: any) {
      this.showToast('error', err?.message || 'Error al guardar la cuenta');
    } finally {
      this.submitting = false;
    }
  }

  async handleToggleStatus(account: Account) {
    if (this.submitting || account.status === 'CANCELLED') return;
    this.submitting = true;
    try {
      const newStatus = account.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await this.accountService.update(account.id, {
        accountNumber: account.accountNumber,
        clientId: account.client?.id,
        accountType: account.accountType,
        balance: account.balance,
        exemptGmf: account.exemptGmf,
        status: newStatus,
      }).toPromise();
      this.showToast('success', newStatus === 'ACTIVE' ? 'Cuenta activada correctamente.' : 'Cuenta inactivada correctamente.');
      this.loadData();
    } catch (err: any) {
      this.showToast('error', err?.message || 'No fue posible actualizar el estado.');
    } finally {
      this.submitting = false;
    }
  }

  async handleDelete() {
    if (!this.activeAccount || this.submitting) return;
    this.submitting = true;
    try {
      await this.accountService.remove(this.activeAccount.id).toPromise();
      this.showToast('success', 'Cuenta eliminada correctamente');
      this.isDeleteOpen = false;
      this.activeAccount = null;
      this.loadData();
    } catch (err: any) {
      this.showToast('error', err?.message || 'Error al eliminar la cuenta');
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

  // Utility methods used in template
  formatAccountType = formatAccountType;
  formatCurrency = formatCurrency;
  formatAccountStatus = formatAccountStatus;
  getAccountStatusClasses = getAccountStatusClasses;
  getBalanceStateClasses = getBalanceStateClasses;
  getBalanceStateLabel = getBalanceStateLabel;
  canEditAccount = canEditAccount;
  canToggleAccount = canToggleAccount;
  canDeleteAccount = canDeleteAccount;

  getClientDisplayName(account: Account): string {
    const matchedClient = this.clients().find(c => c.id === account.client?.id);
    if (matchedClient) return `${matchedClient.firstName} ${matchedClient.lastName}`.trim();
    if (account.client?.firstName || account.client?.lastName) return `${account.client?.firstName ?? ''} ${account.client?.lastName ?? ''}`.trim();
    return 'Sin cliente asignado';
  }
}
