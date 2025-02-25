import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //'http://localhost:9090/api/v1/'
  //'http://localhost:9090/'
  private apiUrl = environment.apiUrl ;

  http = inject(HttpClient);

  isLoggedIn = signal(!!localStorage.getItem('token')); // Estado reactivo

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/login`, credentials,{withCredentials:true});
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
