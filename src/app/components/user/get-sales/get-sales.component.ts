import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Sales } from '../../../types/sales';
import { SaleService } from '../../../service/sale.service';
import { VideogameService } from '../../../service/videogame.service';
import { ClientService } from '../../../service/client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Videogame } from '../../../types/videogame';
import { Client } from '../../../types/client';
import { SalesDetails } from '../../../types/sales-details';
import { LoadingComponent } from "../../modal/loading/loading.component";

@Component({
  selector: 'app-get-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  templateUrl: './get-sales.component.html',
  styleUrl: './get-sales.component.css'
})
export class GetSalesComponent implements OnInit {
  ventas: Sales[] = [];
  ventasDetalles: SalesDetails[] = [];
  isLoading: boolean = true;

  videojuegosMap = new Map<number, string>();
  clientesMap = new Map<number, string>();
  ventasDetailsMap = new Map<number, SalesDetails[]>();

  salesService = inject(SaleService);
  videogameService = inject(VideogameService);
  clientService = inject(ClientService);

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Obtener clientes
    this.clientService.getClient().subscribe(data => {
      this.clientesMap = new Map(data.map(cliente => [cliente.id, cliente.email]));
      this.cdr.detectChanges(); // Forzar actualización de la UI
    });

    // Obtener videojuegos
    this.videogameService.getVideogames().subscribe(data => {
      this.videojuegosMap = new Map(data.map(juego => [juego.id, juego.nombre]));
      this.cdr.detectChanges();
    });

    // Obtener ventas y detalles
    this.salesService.getSales().subscribe(data => {
      this.ventas = data;
      this.cdr.detectChanges();
      this.isLoading = false
    });

  }

  getNombreVideojuego(id: number): string {
    return this.videojuegosMap.get(id) || 'Cargando...';
  }

  getNombreCliente(id: number): string {
    return this.clientesMap.get(id) || 'Cargando...';
  }

}
