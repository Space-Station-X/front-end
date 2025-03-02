import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-navbar-client',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive, CommonModule],
  templateUrl: './navbar-client.component.html',
  styleUrl: './navbar-client.component.css'
})
export class NavbarClientComponent {
  authService = inject(AuthService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  clientId = this.activatedRoute.snapshot.params['clientId'] || '1';

  logout() {
    const modal = new bootstrap.Modal(document.getElementById("modalLogOut")!);
    modal.show();
  }

  hideModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalLogOut')!);
    modal?.hide();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
