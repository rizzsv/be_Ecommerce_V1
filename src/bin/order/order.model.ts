import { OrderStatus, PaymentMethod } from "@prisma/client";

export interface OrderItemInput {
  product_id: string;
  quantity: number;
  price: number;
}

export interface CreateOrderDTO {
  status: OrderStatus;
  total_amount: number;
  shipping_address: string;
  payment_method: PaymentMethod;
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateOrderStatusDTO {
  order_id: string;
  status: OrderStatus;
}

export interface GetOrderDTO {
  search?: string;
  periode: number;
  page: number;
  quantity: number;
}

export interface GetOrderByIdDTO {
  id: string;
  user_id?: string; // Optional for admin queries
}

export interface DeleteOrderDTO {
  id: string;
}
