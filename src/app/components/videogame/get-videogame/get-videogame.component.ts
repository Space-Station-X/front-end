import { Component, OnInit } from '@angular/core';
import { Videogame } from '../../../types/videogame';
import { VideogameService } from '../../../service/videogame.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-get-videogame',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, CommonModule],
  templateUrl: './get-videogame.component.html',
  styleUrl: './get-videogame.component.css'
})
export class GetVideogameComponent implements OnInit {
  getVideojuego: Videogame = {} as Videogame;

  constructor(private readonly videogameService: VideogameService, private readonly activatedRoute: ActivatedRoute ,
    private readonly route:Router
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.videogameService.getVideogameById(id).subscribe(data => {
      this.getVideojuego = data;
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
