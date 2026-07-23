import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ClientService } from '../../core/services/client.service';
import { AccountService } from '../../core/services/account.service';
import { Client, ClientRequest } from '../../core/models/client.model';
import { calculateAge, getClientFullName } from '../../shared/utils/client-utils';
import { ButtonComponent } from '../../shared/components/button.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { SearchBarComponent } from '../../shared/components/search-bar.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [FormsModule, DatePipe, ButtonComponent, ModalComponent, EmptyStateComponent, LoadingSpinnerComponent, SearchBarComponent],
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {
  clients = signal<Client[]>([]);
  accounts = signal<any[]>([]);
  isLoading = signal(true);
  error = signal(false);
  searchQuery = signal('');
  identificationFilter = signal('ALL');
  productFilter = signal('ALL');
  isFormOpen = false;
  isDetailsOpen = false;
  isDeleteOpen = false;
  activeClient: Client | null = null;
  formMode: 'create' | 'edit' = 'create';
  submitting = false;
  openMenuId: number | null = null;

  toggleMenu(id: number) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  // Form fields
  formIdentificationType = 'CC';
  formIdentificationNumber = '';
  formFirstName = '';
  formLastName = '';
  formEmail = '';
  formBirthDate = '';
  formErrors: Record<string, string> = {};

  clientProductMap = computed(() => {
    const map = new Map<number, number>();
    this.accounts().forEach((a: any) => {
      if (a.client?.id) map.set(a.client.id, (map.get(a.client.id) ?? 0) + 1);
    });
    return map;
  });

  filteredClients = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    return this.clients().filter(client => {
      const fullText = [client.firstName, client.lastName, client.identificationNumber, client.email].join(' ').toLowerCase();
      const matchesSearch = !query || fullText.includes(query);
      const matchesIdentification = this.identificationFilter() === 'ALL' || client.identificationType === this.identificationFilter();
      const accountCount = this.clientProductMap().get(client.id) ?? 0;
      const matchesProducts = this.productFilter() === 'ALL' || (this.productFilter() === 'WITH_PRODUCTS' ? accountCount > 0 : accountCount === 0);
      return matchesSearch && matchesIdentification && matchesProducts;
    });
  });

  readonly identificationFilterOptions = ['ALL', 'CC', 'CE', 'PASSPORT', 'NIT'] as const;
  readonly productFilterOptions = ['ALL', 'WITH_PRODUCTS', 'WITHOUT_PRODUCTS'] as const;
  readonly identificationTypes = ['CC', 'CE', 'PASSPORT', 'NIT'];

  // Exposed utility methods for template
  getClientFullName = getClientFullName;
  calculateAge = calculateAge;

  constructor(
    private clientService: ClientService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.isLoading.set(true);
    this.error.set(false);
    this.clientService.list().subscribe({
      next: (data) => { this.clients.set(data); this.isLoading.set(false); },
      error: () => { this.isLoading.set(false); this.error.set(true); },
    });
    this.accountService.list().subscribe({
      next: (data) => this.accounts.set(data),
      error: () => {},
    });
  }

  openCreate() {
    this.formMode = 'create';
    this.activeClient = null;
    this.resetForm();
    this.isFormOpen = true;
  }

  openEdit(client: Client) {
    this.formMode = 'edit';
    this.activeClient = client;
    this.formIdentificationType = client.identificationType;
    this.formIdentificationNumber = client.identificationNumber;
    this.formFirstName = client.firstName;
    this.formLastName = client.lastName;
    this.formEmail = client.email;
    this.formBirthDate = client.birthDate.split('T')[0];
    this.formErrors = {};
    this.isFormOpen = true;
  }

  openDetails(client: Client) {
    this.activeClient = client;
    this.isDetailsOpen = true;
  }

  openDelete(client: Client) {
    const productCount = this.clientProductMap().get(client.id) ?? 0;
    if (productCount > 0) {
      this.showToast('error', 'Este cliente posee productos financieros asociados y no puede ser eliminado.');
      return;
    }
    this.activeClient = client;
    this.isDeleteOpen = true;
  }

  private resetForm() {
    this.formIdentificationType = 'CC';
    this.formIdentificationNumber = '';
    this.formFirstName = '';
    this.formLastName = '';
    this.formEmail = '';
    this.formBirthDate = '';
    this.formErrors = {};
  }

  validateForm(): boolean {
    this.formErrors = {};
    if (!this.formIdentificationType) this.formErrors['identificationType'] = 'Tipo de identificación es requerido';
    if (!this.formIdentificationNumber.trim()) this.formErrors['identificationNumber'] = 'Número de identificación es requerido';
    else if (!/^\d+$/.test(this.formIdentificationNumber)) this.formErrors['identificationNumber'] = 'El número de identificación solo debe contener números';
    else if (this.formIdentificationNumber.length < 5 || this.formIdentificationNumber.length > 20) this.formErrors['identificationNumber'] = 'El número de identificación debe tener entre 5 y 20 dígitos';
    if (!this.formFirstName.trim() || this.formFirstName.trim().length < 2) this.formErrors['firstName'] = 'El nombre debe tener mínimo 2 caracteres';
    if (!this.formLastName.trim() || this.formLastName.trim().length < 2) this.formErrors['lastName'] = 'El apellido debe tener mínimo 2 caracteres';
    if (!this.formEmail.trim()) this.formErrors['email'] = 'Correo electrónico inválido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formEmail)) this.formErrors['email'] = 'Correo electrónico inválido';
    if (!this.formBirthDate) this.formErrors['birthDate'] = 'Fecha de nacimiento es requerida';
    else {
      const date = new Date(this.formBirthDate);
      if (isNaN(date.getTime())) this.formErrors['birthDate'] = 'Fecha inválida';
      else {
        const today = new Date();
        const adult = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        if (date > adult) this.formErrors['birthDate'] = 'El cliente debe ser mayor de edad';
      }
    }
    return Object.keys(this.formErrors).length === 0;
  }

  async handleSubmit() {
    if (this.submitting || !this.validateForm()) return;
    this.submitting = true;
    const payload: ClientRequest = {
      identificationType: this.formIdentificationType,
      identificationNumber: this.formIdentificationNumber.trim(),
      firstName: this.formFirstName.trim().replace(/\s+/g, ' '),
      lastName: this.formLastName.trim().replace(/\s+/g, ' '),
      email: this.formEmail.trim(),
      birthDate: this.formBirthDate,
    };
    try {
      if (this.formMode === 'edit' && this.activeClient) {
        await this.clientService.update(this.activeClient.id, payload).toPromise();
        this.showToast('success', 'Cliente actualizado correctamente');
      } else {
        await this.clientService.create(payload).toPromise();
        this.showToast('success', 'Cliente creado correctamente');
      }
      this.isFormOpen = false;
      this.loadData();
    } catch (err: any) {
      this.showToast('error', err?.message || 'Error al guardar el cliente');
    } finally {
      this.submitting = false;
    }
  }

  async handleDelete() {
    if (!this.activeClient || this.submitting) return;
    this.submitting = true;
    try {
      await this.clientService.remove(this.activeClient.id).toPromise();
      this.showToast('success', 'Cliente eliminado correctamente');
      this.isDeleteOpen = false;
      this.activeClient = null;
      this.loadData();
    } catch (err: any) {
      this.showToast('error', err?.message || 'Error al eliminar el cliente');
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
}
