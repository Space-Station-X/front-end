import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { User } from '../../../types/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  user: User[] = [];

  ngOnInit(): void {

  }

  email = '';
  password = '';

  authService = inject(AuthService);
  router = inject(Router);
  userService = inject(UserService);

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId',response.id);
        this.router.navigate(['/userHome/'+response.id]);
      },
      (error) => {
        console.error('Error en login', error);
      }
    );
  }
}
