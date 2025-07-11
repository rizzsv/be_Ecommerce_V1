import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/custom.config";
import { Wrapper } from "../../utils/wrapper.utils";
import { logRequest } from "../../helper/logger.request";
import { createCart, getCart, updateCart } from "./cart.model";
import { CartService } from "./cart.service";

export class CartController {
  static async createCart(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: createCart = req.body as createCart;

      await logRequest(req, `POST /cart/create` + JSON.stringify(request));

      const response = await CartService.createCart(request);
      Wrapper.success(res, true, response, "Success create cart", 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateCart(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: updateCart = req.body as updateCart;

      await logRequest(req, `PUT /cart/update` + JSON.stringify(request));

      const response = await CartService.updateCart(request);
      Wrapper.success(res, true, response, "Success update cart", 200);
    } catch (error) {
      next(error);
    }
  }

  static async getCart(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: getCart = req.query as unknown as getCart;

      request.periode = Number(request.periode);
      request.page = Number(request.page);
      request.quantity = Number(request.quantity);

      await logRequest(req, `GET /cart/get` + JSON.stringify(request));

      const response = await CartService.getCart(request);
      Wrapper.pagination(
        res,
        true,
        response.metaData,
        "Succes Get Product",
        response.data,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteCart(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request = req.params.id;

      await logRequest(req, `DELETE /cart/delete` + JSON.stringify(request));

      const response = await CartService.deleteCart({id: request});
      Wrapper.success(res, true, response, "Success delete cart", 200);
    } catch (error) {
      next(error);
    }
  }
}
