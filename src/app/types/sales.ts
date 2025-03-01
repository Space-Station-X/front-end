import { SalesDetails } from "./sales-details";

export interface Sales {
    saleId: number;
    customerId: number;
    saleDate: Date;
    totalAmount: number;
    itemCount: number;
    userId: number;
    saleDetails?: SalesDetails[]; 
  }
  