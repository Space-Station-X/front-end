import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Videogame } from '../../../types/videogame';
import { VideogameService } from '../../../service/videogame.service';
import { UserService } from '../../../service/user.service';
import { LoadingComponent } from "../../modal/loading/loading.component";

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [RouterLink, CommonModule, TitleCasePipe, LoadingComponent],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  private videogameService = inject(VideogameService);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  videojuegos = signal<Videogame[]>([]);
  nameUser = signal<string>('');
  isLoading = signal<boolean>(true);

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
}
