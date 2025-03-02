import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-banner',
  standalone: true,
  templateUrl: './welcome-banner.component.html',
  styleUrl: './welcome-banner.component.css'
})
export class WelcomeBannerComponent {
  @Input() title = 'Bienvenido a Polvos Azules';
  @Input() subtitle = 'Explora nuestra colección de videojuegos';
}
