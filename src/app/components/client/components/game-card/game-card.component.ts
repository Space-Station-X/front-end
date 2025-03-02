import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Videogame } from '../../../../types/videogame';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css'
})
export class GameCardComponent {
  @Input({ required: true }) game!: Videogame;
  @Input() clientId!: number;
  @Output() viewDetailsClicked = new EventEmitter<Videogame>();

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

  openDetails(): void {
    this.viewDetailsClicked.emit(this.game);
  }
}
