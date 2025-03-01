import { Component, inject, OnInit, signal } from '@angular/core';
import { Videogame } from '../../../types/videogame';
import { VideogameService } from '../../../service/videogame.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { LoadingComponent } from "../../modal/loading/loading.component";

@Component({
  selector: 'app-get-videogame',
  standalone: true,
  imports: [RouterLink, CommonModule, LoadingComponent, DatePipe],
  templateUrl: './get-videogame.component.html',
  styleUrl: './get-videogame.component.css'
})
export class GetVideogameComponent implements OnInit {
  private videogameService = inject(VideogameService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  videogame = signal<Videogame>({} as Videogame);
  isLoading = signal<boolean>(true);

  userId = this.activatedRoute.parent?.snapshot.params['userId'];
  videogameId = this.activatedRoute.snapshot.params['id'];

  ngOnInit(): void {
    this.loadVideogameDetails();
  }

  private loadVideogameDetails(): void {
    this.videogameService.getVideogameById(this.videogameId).subscribe({
      next: (data) => {
        this.videogame.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar el videojuego:', error);
        this.isLoading.set(false);
      }
    });
  }

  modalDelete(): void {
    const modalElement = document.getElementById('modalDelete');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  deleteVideojuego(id: number): void {
    this.isLoading.set(true);

    this.videogameService.deleteVideogame(id).subscribe({
      next: () => {
        const confirmModal = bootstrap.Modal.getInstance(document.getElementById('modalDelete')!);
        confirmModal?.hide();

        setTimeout(() => {
          this.isLoading.set(false);
          const successModal = new bootstrap.Modal(document.getElementById('modalAviso')!);
          successModal.show();
          const modalElement = document.getElementById('modalAviso');
          if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', () => {
              this.router.navigate(['/userHome', this.userId]);
            });
          }
        }, 500);
      },
      error: (error) => {
        console.error('Error al eliminar el videojuego:', error);
        this.isLoading.set(false);
      }
    });
  }
}
