export interface createCart {
  user_id: string;
  product: {
    product_id: string;
    quantity: number;
  }[];
}


export interface updateCart {
  userId: string;
  product: {
    productId: string;
    quantity: number;
  }
}

export interface getCart {
  search?: string;
  page: number;
  quantity: number;
  periode: number;
}

export interface deleteCart {
  id: string;
}