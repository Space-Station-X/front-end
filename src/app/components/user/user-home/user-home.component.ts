import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Videogame } from '../../../types/videogame';
import { VideogameService } from '../../../service/videogame.service';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  videojuegos: Videogame[] = []
  constructor(private videogameService: VideogameService) { }

  ngOnInit(): void {
    this.videogameService.getVideogames().subscribe(
      (data: Videogame[]) => { this.videojuegos = data }

    )

  }
}
