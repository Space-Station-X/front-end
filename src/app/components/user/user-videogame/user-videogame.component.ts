import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Videogame } from '../../../types/videogame';
import { VideogameService } from '../../../service/videogame.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-videogame',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './user-videogame.component.html',
  styleUrl: './user-videogame.component.css'
})
export class UserVideogameComponent implements OnInit {
  videojuegos: Videogame[] = []
  constructor(private videogameService: VideogameService) { }

  ngOnInit(): void {
    this.videogameService.getVideogames().subscribe(
      (data: Videogame[]) => { this.videojuegos = data }

    )

  }
}
