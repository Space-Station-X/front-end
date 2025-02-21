import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from '../types/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  http = inject(HttpClient)
  private url = 'http://localhost:3001';

  getClient() {
    return this.http.get<Client[]>(`${this.url}/clients`);
  }

  getClientById(id: number) {
    return this.http.get<Client>(`${this.url}/clients/${id}`);
  }

  createClient(client: Client) {
    return this.http.post<Client>(`${this.url}/clients`, client);
  }

  updateClient(client: Client) {
    return this.http.put<Client>(`${this.url}/clients/${client.id}`, client);
  }

  deleteClient(id: number) {
    return this.http.delete(`${this.url}/clients/${id}`);
  }
}
