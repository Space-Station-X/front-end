import { Component, inject, OnInit } from '@angular/core';
import { Videogame } from '../../../types/videogame';
import { VideogameService } from '../../../service/videogame.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { LoadingComponent } from "../../modal/loading/loading.component";
@Component({
  selector: 'app-get-videogame',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, CommonModule, LoadingComponent],
  templateUrl: './get-videogame.component.html',
  styleUrl: './get-videogame.component.css'
})
export class GetVideogameComponent implements OnInit {
  getVideojuego: Videogame = {} as Videogame;

  homeRoute = inject(ActivatedRoute);
  videogameService = inject(VideogameService);
  route = inject(Router);
  isLoading : boolean = true

  userId = this.homeRoute.parent?.snapshot.params['userId'];
  videogameId = this.homeRoute.snapshot.params['id'];
  
  ngOnInit(): void {
    this.videogameService.getVideogameById(this.videogameId).subscribe(data => {
      this.getVideojuego = data;
      this.isLoading
    });
  }

  modalDelete() {
    const modalElement = document.getElementById('modalDelete');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  deleteVideojuego(id: number) {
    this.videogameService.deleteVideogame(id).subscribe(
      () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalDelete')!);
        modal?.hide();

        const modalElement = document.getElementById('modalAviso');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
        this.route.navigate(["/userHome/1"]);
      }
    )
  }

}
