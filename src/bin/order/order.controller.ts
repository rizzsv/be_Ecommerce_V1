import { Request, Response, NextFunction } from "express";
import { CreateOrderDTO, GetOrderDTO, UpdateOrderStatusDTO } from "./order.model";
import { OrderService } from "./order.service";
import { Wrapper } from "../../utils/wrapper.utils";
import { logRequest } from "../../helper/logger.request";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";

export class OrderController {
  static async createOrder(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: CreateOrderDTO = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new ErrorHandler(401, "User tidak terautentikasi");
      }

      await logRequest(req, `POST /order/create ` + JSON.stringify(request));

      const result = await OrderService.createOrder(request, userId);

      Wrapper.success(res, true, result, "Sukses membuat pesanan", 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request : UpdateOrderStatusDTO = req.body as UpdateOrderStatusDTO

      await logRequest(req, `PUT /order/update-status ${JSON.stringify(request)}`);

      const response = await OrderService.updateOrderStatus(request)
      Wrapper.success(res, true, response, 'Sukses mengupdate status pesanan', 200);
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request = req.params.id;

      await logRequest(req, `PUT /order/getById ${JSON.stringify(request)}`);

      const response = await OrderService.getOrderById({id: request})
      Wrapper.success(res, true, response, "Sukses mendapatkan produk", 200);
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrders(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request : GetOrderDTO = req.query as unknown as GetOrderDTO;
      await logRequest(req, `PUT /order/getById ${JSON.stringify(request)}`);

      request.periode = Number(request.periode);
      request.page = Number(request.page);
      request.quantity = Number(request.quantity);

      const response = await OrderService.getAllOrders(request);
      Wrapper.success(res, true, response, "Sukses mendapatkan semua pesanan", 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteOrder(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request = req.params.id;

      await logRequest(req, `PUT /order/Delete ${JSON.stringify(request)}`);

      const response = await OrderService.deleteOrder({ id: request });
      Wrapper.success(res, true, response, "Sukses menghapus pesanan", 200);
    } catch (error) {
      next(error);
    }
  }
}
