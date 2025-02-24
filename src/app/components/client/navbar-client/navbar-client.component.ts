import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-navbar-client',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './navbar-client.component.html',
  styleUrl: './navbar-client.component.css'
})
export class NavbarClientComponent {

  authService = inject(AuthService)
  router = inject(Router)

  logout() {
    const modal = new bootstrap.Modal(document.getElementById("modalLogOut")!)
    modal.show()
  }
  hideModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalLogOut')!)
    modal?.hide()
    this.authService.logout()
    this.router.navigate(['/'])
  }

}
