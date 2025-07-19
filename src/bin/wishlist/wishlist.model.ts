export interface CreateWishlist {
  product_id: string;
}

export interface GetWishList {
  product_id: string;
  search?: string;
  periode: number;
  page: number;
  quantity: number;
}

export interface DeleteWishlist {
  id: string;
}
