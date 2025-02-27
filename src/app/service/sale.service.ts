import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Sales } from '../types/sales';
import { SalesDetails } from '../types/sales-details';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  //http://localhost:3010/
  private url = environment.apiUrl
  http = inject(HttpClient)
  getSales() {
    return this.http.get<Sales[]>(`${this.url}ventas`);
  }

  getSaleById(id: number){
    return this.http.get<Sales>(`${this.url}ventas/${id}`);
  }

  createSale(venta: Sales){
    return this.http.post<Sales>(`${this.url}ventas`, venta);
  }

  createSaleDetails(detalles : SalesDetails){
    return this.http.post<SalesDetails>(`${this.url}ventas-detalles`, detalles);
  }
  
  getSalesDetails() {
    return this.http.get<SalesDetails[]>(`${this.url}ventas-detalles`);
  }
 
}
