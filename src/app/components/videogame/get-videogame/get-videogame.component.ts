import { Component, OnInit } from '@angular/core';
import { Videogame } from '../../../types/videogame';
import { VideogameService } from '../../../service/videogame.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-get-videogame',
  standalone: true,
  imports: [RouterLink , CurrencyPipe],
  templateUrl: './get-videogame.component.html',
  styleUrl: './get-videogame.component.css'
})
export class GetVideogameComponent implements OnInit {
  getVideojuego: Videogame = {} as Videogame;

  constructor(private readonly videogameService: VideogameService, private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.videogameService.getVideogameById(id).subscribe(data => {
      this.getVideojuego = data;
    });
  }

}
