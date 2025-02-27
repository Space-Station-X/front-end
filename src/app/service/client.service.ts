import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from '../types/client';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  http = inject(HttpClient)
  //'http://localhost:3001'
  private url = environment.apiUrl;

  getClient() {
    return this.http.get<Client[]>(`${this.url}client`);
  }

  getClientById(id: number) {
    return this.http.get<Client>(`${this.url}client/${id}`);
  }

  createClient(client: Client) {
    return this.http.post<Client>(`${this.url}client`, client);
  }

  updateClient(client: Client) {
    return this.http.put<Client>(`${this.url}client/${client.id}`, client);
  }

  deleteClient(id: number) {
    return this.http.delete(`${this.url}client/${id}`);
  }
}
