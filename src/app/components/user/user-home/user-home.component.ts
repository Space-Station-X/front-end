import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Videogame } from '../../../types/videogame';
import { VideogameService } from '../../../service/videogame.service';
import { UserService } from '../../../service/user.service';
import { LoadingComponent } from "../../modal/loading/loading.component";
import { ExportService, PDFConfig } from '../../../service/export.service';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [RouterLink, CommonModule, TitleCasePipe, LoadingComponent],
  providers: [DatePipe],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  private videogameService = inject(VideogameService);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private exportService = inject(ExportService);
  private datePipe = inject(DatePipe);

  videojuegos = signal<Videogame[]>([]);
  nameUser = signal<string>('');
  isLoading = signal<boolean>(true);
  isExporting = signal<boolean>(false);

  hasGames = computed(() => this.videojuegos().length > 0);

  userId = this.route.snapshot.params['userId'];

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.userService.geUserById(this.userId).subscribe({
      next: (data) => {
        this.nameUser.set(data.username);
        this.loadVideogames();
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
        this.isLoading.set(false);
      }
    });
  }

  private loadVideogames(): void {
    this.videogameService.getVideogames().subscribe({
      next: (data: Videogame[]) => {
        this.videojuegos.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar los videojuegos:', error);
        this.isLoading.set(false);
      }
    });
  }

  exportToExcel(): void {
    if (this.isExporting()) return;
    this.isExporting.set(true);

    try {
      const excelData = this.videojuegos().map((game, index) => ({
        'N°': index + 1,
        'Nombre': game.nombre,
        'Plataforma': game.plataforma,
        'Precio (S/)': game.precio,
        'Copias Disponibles': game.nuCopias
      }));

      this.exportService.exportToExcel(
        excelData,
        `catalogo_videojuegos_${this.nameUser()}`,
        'Catálogo'
      );
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
    } finally {
      this.isExporting.set(false);
    }
  }

  async exportToPDF(): Promise<void> {
    if (this.isExporting()) return;
    this.isExporting.set(true);

    try {
      const fecha = this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '';

      const pdfConfig: PDFConfig = {
        title: 'Catálogo de Videojuegos',
        fileName: `catalogo_videojuegos_${this.nameUser()}`,
        headerInfo: [
          { text: `Usuario: ${this.nameUser()}`, alignment: 'left' },
          { text: `Fecha: ${fecha}`, alignment: 'left' },
          { text: `Total de juegos: ${this.videojuegos().length}`, alignment: 'left' }
        ],
        tableData: [
          {
            headers: ['#', 'Nombre', 'Plataforma', 'Precio (S/)', 'Copias Disp.'],
            data: this.videojuegos().map((game, index) => [
              index + 1,
              game.nombre,
              game.plataforma,
              game.precio,
              game.nuCopias
            ]),
            title: 'Listado de Videojuegos',
            columnStyles: {
              0: { cellWidth: 10, halign: 'center' },
              1: { cellWidth: 'auto' },
              2: { cellWidth: 40 },
              3: { cellWidth: 25, halign: 'right' },
              4: { cellWidth: 25, halign: 'center' }
            }
          }
        ]
      };

      await this.exportService.exportToPDF(pdfConfig);
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
    } finally {
      this.isExporting.set(false);
    }
  }
}
