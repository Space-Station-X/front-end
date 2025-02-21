import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../../service/client.service';
import { ActivatedRoute } from '@angular/router';
import { Client } from '../../../types/client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-get-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './get-client.component.html',
  styleUrl: './get-client.component.css'
})
export class GetClientComponent implements OnInit {

  getClient: Client = {} as Client

  clientService = inject(ClientService)
  homeRoute = inject(ActivatedRoute)
  clientId = this.homeRoute.snapshot.params['clientId']

  ngOnInit(): void {
    this.clientService.getClientById(this.clientId).subscribe(
      (data : Client) => { this.getClient = data }
    )
  }


}
