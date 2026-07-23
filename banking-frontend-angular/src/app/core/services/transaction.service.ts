import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, TransactionRequest } from '../models/transaction.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class TransactionService extends ApiService {
  private readonly resource = '/transactions';

  constructor(http: HttpClient) {
    super(http);
  }

  list(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}${this.resource}`);
  }

  get(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}${this.resource}/${id}`);
  }

  create(payload: TransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}${this.resource}`, payload);
  }
}
