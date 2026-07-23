import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientRequest } from '../models/client.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ClientService extends ApiService {
  private readonly resource = '/clients';

  constructor(http: HttpClient) {
    super(http);
  }

  list(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}${this.resource}`);
  }

  get(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}${this.resource}/${id}`);
  }

  create(payload: ClientRequest): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}${this.resource}`, payload);
  }

  update(id: number, payload: Partial<ClientRequest>): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}${this.resource}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.resource}/${id}`);
  }
}
