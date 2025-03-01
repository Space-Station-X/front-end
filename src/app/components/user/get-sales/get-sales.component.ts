import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Sales } from '../../../types/sales';
import { SaleService } from '../../../service/sale.service';
import { VideogameService } from '../../../service/videogame.service';
import { ClientService } from '../../../service/client.service';
import { CommonModule, DatePipe } from '@angular/common';
import { SalesDetails } from '../../../types/sales-details';
import { LoadingComponent } from "../../modal/loading/loading.component";
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-get-sales',
  standalone: true,
  imports: [CommonModule, DatePipe, LoadingComponent, RouterLink],
  templateUrl: './get-sales.component.html',
  styleUrl: './get-sales.component.css'
})
export class GetSalesComponent implements OnInit {
  private salesService = inject(SaleService);
  private videogameService = inject(VideogameService);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  ventas = signal<Sales[]>([]);
  videojuegosMap = signal<Map<number, string>>(new Map());
  clientesMap = signal<Map<number, string>>(new Map());
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  userId = this.route.parent?.snapshot.params['userId'];
  hasVentas = computed(() => this.ventas().length > 0);

  ngOnInit(): void {
    this.loadData();
  }


  private loadData(): void {
    forkJoin({
      clientes: this.clientService.getClientDTO(),
      videojuegos: this.videogameService.getVideogames(),
      ventas: this.salesService.getSales()
    }).subscribe({
      next: (results) => {
        this.clientesMap.set(
          new Map(results.clientes.map(cliente => [cliente.id, cliente.numberDate]))
        );

        this.videojuegosMap.set(
          new Map(results.videojuegos.map(juego => [juego.id, juego.nombre]))
        );

        this.ventas.set(results.ventas);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
        this.error.set('No se pudieron cargar los datos. Por favor, inténtelo de nuevo más tarde.');
        this.isLoading.set(false);
      }
    });
  }


  getNombreVideojuego(id: number): string {
    return this.videojuegosMap().get(id) || 'Desconocido';
  }

  getNombreCliente(id: number): string {
    return this.clientesMap().get(id) || 'Cliente Desconocido';
  }
}
