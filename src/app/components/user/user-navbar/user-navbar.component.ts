import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../types/user';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../../service/auth.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [RouterLink, RouterOutlet, TitleCasePipe, CommonModule],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css'
})
export class UserNavbarComponent implements OnInit {

  user: User = {} as User;

  authService = inject(AuthService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.params['userId'];

  }
  logout() {
    const modal = new bootstrap.Modal(document.getElementById('modalLogOut')!)
    modal.show();
  }

  hideModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalLogOut')!);
    modal?.hide();
    this.authService.logout();
    this.router.navigate(['/']);
    
  }

}
