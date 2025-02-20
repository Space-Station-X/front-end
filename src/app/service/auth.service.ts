import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9090/auth';

  http = inject(HttpClient);

  isLoggedIn = signal(!!localStorage.getItem('token')); // Estado reactivo

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.isLoggedIn.set(false); 
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn(); 
  }
}
