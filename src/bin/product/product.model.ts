export interface createProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  images?: string[];
  variants?: VariantInput[];
}

export interface updateProduct {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string;
  status?: string;
  category?: string;
  category_id?: string;
  variants?: VariantInput[]
}

export interface getProductById {
  id: string;
}

export interface getProduct {
  search?: string;
  periode: number;
  page: number;
  quantity: number;
  category?: string;
}

export interface deleteProduct {
  id: string;
}

export interface VariantInput {
  size: string;
  color: string;
  stock: number;
}
