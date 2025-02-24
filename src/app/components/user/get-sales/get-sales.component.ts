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

@Component({
  selector: 'app-get-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './get-sales.component.html',
  styleUrl: './get-sales.component.css'
})
export class GetSalesComponent implements OnInit {
  ventas: Sales[] = []
  ventasDetalles: SalesDetails[] = []


  videojuegosMap = new Map<number, string>();
  clientesMap = new Map<number, string>();
  ventasDetailsMap = new Map<number, SalesDetails[]>();

  salesService = inject(SaleService)
  videogameService = inject(VideogameService)
  clientService = inject(ClientService)
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    
    
    this.clientService.getClient().subscribe(data => {
      this.clientesMap = new Map(data.map(cliente => [cliente.id, cliente.email]));
    });
    
    this.videogameService.getVideogames().subscribe(data => {
      this.videojuegosMap = new Map(data.map(juego => [juego.id, juego.nombre]));
    });

    this.salesService.getSalesDetails().subscribe(data => {
      this.ventasDetailsMap = new Map<number, SalesDetails[]>(); 
      data.forEach(detalle => {
        if (!this.ventasDetailsMap.has(detalle.saleId)) {
          this.ventasDetailsMap.set(detalle.saleId, []);
        }
        this.ventasDetailsMap.get(detalle.saleId)?.push(detalle);
      });
    });

    this.salesService.getSales().subscribe(
      data => this.ventas = data
    )

  }


  getNombreVideojuego(id: number): string {
    return this.videojuegosMap.get(id) || 'Cargando...';
  }

  getNombreCliente(id: number): string {
    return this.clientesMap.get(id) || 'Cargando...';
  }

  getDetallesVenta(saleId: number): SalesDetails[] {
    return this.ventasDetailsMap.get(saleId) || [];
  }

}
