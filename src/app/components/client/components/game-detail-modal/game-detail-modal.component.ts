import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Videogame } from '../../../../types/videogame';

@Component({
  selector: 'app-game-detail-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game-detail-modal.component.html',
  styleUrl: './game-detail-modal.component.css'
})
export class GameDetailModalComponent {
  @Input() game: Videogame | null = null;
  @Input() clientId!: number;
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  formatDate(dateInput: Date | string | undefined): string {
    if (!dateInput) {
      return 'Fecha no disponible';
    }
    return dateInput instanceof Date ?
      dateInput.toLocaleDateString() : String(dateInput);
  }

  formatPrice(price: number | undefined): string {
    if (price === undefined || price === null) {
      return 'Precio no disponible';
    }
    return `S/ ${price.toFixed(2)}`;
  }

  closeModal(): void {
    this.close.emit();
  }
}
