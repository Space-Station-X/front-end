import { SalesDetails } from "./sales-details";

export interface Sales {
    id: number;
    customerId: number;
    saleDate: Date;
    totalAmount: number;
    itemCount: number;
    userId: number;
    saleDetails?: SalesDetails[]; 
  }
  