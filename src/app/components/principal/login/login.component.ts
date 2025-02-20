import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';
  authService = inject(AuthService);
  router = inject(Router);

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.id);
        this.router.navigate(['/userHome/' + response.id]);
      },
      (error) => {
        this.errorMessage = "Correo o contraseña incorrectos"
        this.email = ""
        this.password = ""
      }
    );
  }
}
