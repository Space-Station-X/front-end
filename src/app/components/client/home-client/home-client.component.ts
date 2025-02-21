import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../../service/client.service';
import { VideogameService } from '../../../service/videogame.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Client } from '../../../types/client';
import { Videogame } from '../../../types/videogame';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-client.component.html',
  styleUrl: './home-client.component.css'
})
export class HomeClientComponent implements OnInit{

  client : Client = {} as Client
  videogames : Videogame[] = []
  clientService = inject(ClientService)
  videogameService = inject(VideogameService)
  activatedRoute = inject(ActivatedRoute)
  clientId = this.activatedRoute.snapshot.params['clientId']

  ngOnInit(): void {
      this.clientService.geClientById(this.clientId).subscribe(
        (data)=> this.client = data,
      )
      this.videogameService.getVideogames().subscribe(
        (data)=> this.videogames = data,
      )
  }

}
