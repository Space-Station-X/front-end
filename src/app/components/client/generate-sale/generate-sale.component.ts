import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { SaleService } from '../../../service/sale.service';
import { VideogameService } from '../../../service/videogame.service';
import { ClientService } from '../../../service/client.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Videogame } from '../../../types/videogame';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sales } from '../../../types/sales';
import { SalesDetails } from '../../../types/sales-details';
import * as bootstrap from 'bootstrap';
import { LoadingComponent } from "../../modal/loading/loading.component";

@Component({
  selector: 'app-generate-sale',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, FormsModule, LoadingComponent],
  templateUrl: './generate-sale.component.html',
  styleUrl: './generate-sale.component.css'
})
export class GenerateSaleComponent implements OnInit {
  // Convert to signals
  item = signal<Videogame>({} as Videogame);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');
  quantity = signal<number>(1);

  // Services
  saleService = inject(SaleService);
  videogameService = inject(VideogameService);
  clientService = inject(ClientService);
  router = inject(Router);

  // Router params
  homeRoute = inject(ActivatedRoute);
  clientId = this.homeRoute.parent?.snapshot.params['clientId'];
  videogameId = this.homeRoute.snapshot.params['id'];

  // Computed values
  totalAmount = computed(() => this.item().precio * this.quantity());
  stockAvailable = computed(() => this.item().nuCopias > 0);
  maxQuantity = computed(() => this.item().nuCopias);

  // Form
  saleForm = new FormGroup({
    cantidad: new FormControl<number>(1, [
      Validators.required,
      Validators.min(1)
    ])
  });

  ngOnInit(): void {
    this.videogameService.getVideogameById(this.videogameId).subscribe(
      data => {
        this.item.set(data);
        this.isLoading.set(false);
      }
    );

    // Connect form to signal
    this.saleForm.get('cantidad')?.valueChanges.subscribe(value => {
      if (value !== null) {
        this.quantity.set(value);
      }
    });
  }

  onSubmit() {
    const currentQuantity = this.quantity();
    const currentItem = this.item();

    if (currentQuantity <= currentItem.nuCopias) {
      const ventaDetalle: SalesDetails = {
        quantity: currentQuantity,
        salePrice: currentItem.precio,
        totalAmount: this.totalAmount(),
        videoGameId: Number(this.videogameId)
      } as SalesDetails;

      const venta: Sales = {
        customerId: Number(this.clientId),
        saleDate: new Date(),
        totalAmount: ventaDetalle.totalAmount,
        itemCount: ventaDetalle.quantity,
        userId: 1,
        saleDetails: [ventaDetalle]
      } as Sales;

      this.saleService.createSale(venta).subscribe(
        data => {
          const updatedItem = { ...currentItem };
          updatedItem.nuCopias = updatedItem.nuCopias - venta.itemCount;
          updatedItem.activo = updatedItem.nuCopias === 0 ? "N" : "S";

          this.item.set(updatedItem);
          this.videogameService.updateVideogame(updatedItem).subscribe();

          // Show success modal
          const modal = new bootstrap.Modal(document.getElementById("modalSale")!);
          modal.show();
        }
      );
    } else {
      this.errorMessage.set(`Disculpenos, tenemos stock limitado. Solo nos quedan ${currentItem.nuCopias}`);
    }
  }
  goBack(): void {
    // Navigate to the parent route (typically the client's games list)
    this.router.navigate(['/clientHome', this.clientId]);
  }
  hideModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalSale")!);
    modal?.hide();
    this.goBack()
  }
}
