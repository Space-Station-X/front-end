import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Videogame } from '../types/videogame';

@Injectable({
  providedIn: 'root'
})
export class VideogameService {
  url = "http://localhost:8080/api/v1";
  constructor(private http: HttpClient) { }

  getVideogames() {
    return this.http.get<Videogame[]>(`${this.url}/videojuegos`);
  }

  getVideogameById(id: number) {
    return this.http.get<Videogame>(`${this.url}/videojuegos/${id}`);
  }

  createVideogame(videogame: Videogame) {
    return this.http.post<Videogame>(`${this.url}/videojuegos`, videogame);
  }

  updateVideogame(videogame: Videogame) {
    return this.http.put<Videogame>(`${this.url}/videojuegos/${videogame.id}`, videogame);
  }

  deleteVideogame(id: number) {
    return this.http.delete(`${this.url}/videojuegos/${id}`);
  }
  
}
