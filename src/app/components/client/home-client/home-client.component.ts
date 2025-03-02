import { Component, inject, OnInit, signal } from '@angular/core';
import { ClientService } from '../../../service/client.service';
import { VideogameService } from '../../../service/videogame.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Client } from '../../../types/client';
import { Videogame } from '../../../types/videogame';
import { CommonModule, DatePipe } from '@angular/common';
import { LoadingComponent } from "../../modal/loading/loading.component";

@Component({
  selector: 'app-home-client',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent],
  providers: [DatePipe],
  templateUrl: './home-client.component.html',
  styleUrl: './home-client.component.css'
})
export class HomeClientComponent implements OnInit {
  private clientService = inject(ClientService);
  private videogameService = inject(VideogameService);
  private activatedRoute = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);

  client = signal<Client>({} as Client);
  videogames = signal<Videogame[]>([]);
  isLoading = signal<boolean>(true);
  clientId = signal<number>(this.activatedRoute.snapshot.params['clientId']);

  // Propiedades para el modal
  showModal = false;
  selectedGame: Videogame | null = null;

  ngOnInit(): void {
    this.loadClientData();
    this.loadVideogames();
  }

  // Método actualizado para manejar diferentes tipos de datos de fecha
  formatDate(dateInput: Date | string | undefined): string {
    if (!dateInput) {
      return 'Fecha no disponible';
    }
    return this.datePipe.transform(dateInput, 'dd/MM/yyyy') || String(dateInput);
  }
  formatPrice(price: number | undefined): string {
    if (price === undefined || price === null) {
      return 'Precio no disponible';
    }
    return `S/ ${price.toFixed(2)}`;
  }
  // Métodos para el modal
  openGameDetails(game: Videogame): void {
    this.selectedGame = game;
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.showModal = false;
    document.body.classList.remove('modal-open');
  }

  private loadClientData(): void {
    this.clientService.getClientById(this.clientId()).subscribe({
      next: (data) => this.client.set(data),
      error: (err) => console.error('Error loading client data:', err)
    });
  }

  private loadVideogames(): void {
    this.videogameService.getVideogames().subscribe({
      next: (data) => {
        this.videogames.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading videogames:', err);
        this.isLoading.set(false);
      }
    });
  }
}
