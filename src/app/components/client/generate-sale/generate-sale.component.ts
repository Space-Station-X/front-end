import { Component, inject, OnInit } from '@angular/core';
import { SaleService } from '../../../service/sale.service';
import { VideogameService } from '../../../service/videogame.service';
import { ClientService } from '../../../service/client.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Videogame } from '../../../types/videogame';
import { FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sales } from '../../../types/sales';
import { SalesDetails } from '../../../types/sales-details';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-generate-sale',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './generate-sale.component.html',
  styleUrl: './generate-sale.component.css'
})
export class GenerateSaleComponent implements OnInit {
  item: Videogame = {} as Videogame
  venta: Sales = {} as Sales
  ventaDetalle: SalesDetails = {} as SalesDetails

  saleService = inject(SaleService)
  videogameService = inject(VideogameService)
  clientService = inject(ClientService)

  homeRoute = inject(ActivatedRoute)
  clientId = this.homeRoute.parent?.snapshot.params['clientId']
  videogameId = this.homeRoute.snapshot.params['id']

  ngOnInit(): void {
    this.videogameService.getVideogameById(this.videogameId).subscribe(
      data => { this.item = data }
    )
  }

  saleForm = new FormGroup(
    {
      cantidad: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(1)
      ]),
    }
  )

  onSubmit() {
    this.ventaDetalle.salePrice = this.item.precio
    this.ventaDetalle.totalAmount = this.item.precio * this.ventaDetalle.quantity
    this.ventaDetalle.videoGameId = Number(this.videogameId)

    this.venta.customerId = Number(this.clientId)
    this.venta.saleDate = new Date()
    this.venta.totalAmount = this.ventaDetalle.totalAmount
    this.venta.itemCount = this.ventaDetalle.quantity
    this.venta.userId = Number("1")
    this.venta.saleDetails = [this.ventaDetalle]
    //this.venta.saleDetails = [this.ventaDetalle]



    this.saleService.createSale(this.venta).subscribe(
      data => {
        this.item.nuCopias = this.item.nuCopias - this.venta.itemCount
        this.videogameService.updateVideogame(this.item).subscribe()
        //mensaje Modal
        const modal = new bootstrap.Modal(document.getElementById("modalSale")!)
        modal.show()
      }
    )
  }

  hideModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalSale")!)
    modal?.hide()

  }

}
