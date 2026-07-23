import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, AccountRequest, AccountType } from '../models/account.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AccountService extends ApiService {
  private readonly resource = '/accounts';

  constructor(http: HttpClient) {
    super(http);
  }

  list(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}${this.resource}`);
  }

  get(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}${this.resource}/${id}`);
  }

  create(payload: AccountRequest): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}${this.resource}`, payload);
  }

  update(id: number, payload: Partial<AccountRequest>): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}${this.resource}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.resource}/${id}`);
  }

  generateAccountNumber(accountType: AccountType, existingAccounts: Account[]): string {
    const prefix = accountType === 'SAVINGS' ? '53' : '33';
    const usableAccounts = (existingAccounts || []);

    const existingSuffixes = usableAccounts
      .filter((a) => a.accountNumber.startsWith(prefix))
      .map((a) => parseInt(a.accountNumber.slice(2), 10))
      .filter((v) => !isNaN(v))
      .sort((a, b) => a - b);

    let nextSuffix = existingSuffixes.length > 0 ? existingSuffixes[existingSuffixes.length - 1] + 1 : 1;

    const usedNumbers = new Set(
      usableAccounts
        .filter((a) => a.accountNumber.startsWith(prefix))
        .map((a) => a.accountNumber)
    );

    let candidate = '';
    do {
      candidate = prefix + String(nextSuffix).padStart(8, '0');
      nextSuffix++;
    } while (usedNumbers.has(candidate));

    return candidate;
  }
}
