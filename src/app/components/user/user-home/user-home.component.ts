import { Component, Inject, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Videogame } from '../../../types/videogame';
import { VideogameService } from '../../../service/videogame.service';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [RouterLink, CommonModule, TitleCasePipe],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  videojuegos: Videogame[] = []

  videogameService = inject(VideogameService);
  route = inject(ActivatedRoute);
  userId = this.route.snapshot.params['userId'];
  userService = inject(UserService)
  nameUser = ''

  ngOnInit(): void {

    this.userService.geUserById(this.userId).subscribe(
      (data)=>{this.nameUser = data.username}
    )

    this.videogameService.getVideogames().subscribe(
      (data: Videogame[]) => { this.videojuegos = data }
    )

  }
}
