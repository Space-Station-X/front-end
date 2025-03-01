export interface SalesDetails {
    saleDetailId: number;
    sale:{
      saleId: number | null;
    }
    videoGameId: number;
    quantity: number;
    salePrice: number;
    totalAmount: number;
  }
  