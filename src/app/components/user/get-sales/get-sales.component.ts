import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Sales } from '../../../types/sales';
import { SaleService } from '../../../service/sale.service';
import { VideogameService } from '../../../service/videogame.service';
import { ClientService } from '../../../service/client.service';
import { CommonModule, DatePipe } from '@angular/common';
import { LoadingComponent } from "../../modal/loading/loading.component";
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExportService, PDFConfig, PDFTableConfig } from '../../../service/export.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-get-sales',
  standalone: true,
  imports: [CommonModule, DatePipe, LoadingComponent, RouterLink],
  providers: [DatePipe],
  templateUrl: './get-sales.component.html',
  styleUrl: './get-sales.component.css'
})
export class GetSalesComponent implements OnInit {
  private salesService = inject(SaleService);
  private videogameService = inject(VideogameService);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  private exportService = inject(ExportService);

  ventas = signal<Sales[]>([]);
  videojuegosMap = signal<Map<number, string>>(new Map());
  clientesMap = signal<Map<number, string>>(new Map());
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  isExporting = signal<boolean>(false);

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


  exportToExcel(): void {
    this.isExporting.set(true);

    try {
      const worksheetData = [];

      worksheetData.push(['REPORTE DE VENTAS']);
      worksheetData.push(['Fecha de generación:', this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm')]);
      worksheetData.push(['Total de ventas:', this.ventas().length.toString()]);
      worksheetData.push([]);

      this.ventas().forEach((venta, index) => {
        // Encabezado de la venta
        worksheetData.push([`VENTA #${index + 1}`]);
        worksheetData.push(['Fecha:', this.datePipe.transform(venta.saleDate, 'dd/MM/yyyy')]);
        worksheetData.push(['Cliente:', this.getNombreCliente(venta.customerId)]);
        worksheetData.push(['Items:', venta.itemCount.toString(), 'Total:', `S/ ${venta.totalAmount}`]);

        // Encabezados de los detalles
        worksheetData.push([
          'N°', 'VIDEOJUEGO', 'CANTIDAD', 'PRECIO UNITARIO (S/)', 'TOTAL (S/)'
        ]);

        // Detalles de la venta
        venta.saleDetails?.forEach((detalle, i) => {
          worksheetData.push([
            i + 1,
            this.getNombreVideojuego(detalle.videoGameId),
            detalle.quantity,
            detalle.salePrice,
            detalle.totalAmount
          ]);
        });

        worksheetData.push([]);
        worksheetData.push([]);  // Doble espacio para mejor visualización
      });

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');

      this.exportService.exportWorkbookToExcel(workbook, 'reporte_ventas');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
    } finally {
      this.isExporting.set(false);
    }
  }


  async exportToPDF(): Promise<void> {
    this.isExporting.set(true);

    try {
      const pdfConfig: PDFConfig = {
        title: 'Reporte de Ventas',
        fileName: 'reporte_ventas',
        headerInfo: [
          { text: `Reporte generado: ${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}`, alignment: 'left' },
          { text: `Total de ventas: ${this.ventas().length}`, alignment: 'left' }
        ],
        tableData: []
      };

      this.ventas().forEach((venta, index) => {
        const tableConfig: PDFTableConfig = {
          headers: ['#', 'Videojuego', 'Cantidad', 'Precio (S/)', 'Total (S/)'],
          data: [],
          title: `Venta #${index + 1} - ${this.datePipe.transform(venta.saleDate, 'dd/MM/yyyy')} - Cliente: ${this.getNombreCliente(venta.customerId)}`,
          subTitle: `Items: ${venta.itemCount} | Total: S/ ${venta.totalAmount}`,
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 25, halign: 'right' },
            4: { cellWidth: 25, halign: 'right' }
          }
        };

        venta.saleDetails?.forEach((detalle, i) => {
          tableConfig.data.push([
            i + 1,
            this.getNombreVideojuego(detalle.videoGameId),
            detalle.quantity,
            detalle.salePrice,
            detalle.totalAmount
          ]);
        });

        pdfConfig.tableData.push(tableConfig);
      });

      // Ahora usamos await ya que el método es asíncrono
      await this.exportService.exportToPDF(pdfConfig);
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
    } finally {
      this.isExporting.set(false);
    }
  }
}
