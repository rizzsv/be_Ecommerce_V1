import { NextFunction, Response } from "express";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import { Wrapper } from "../../utils/wrapper.utils";
import { logRequest } from "../../helper/logger.request";
import { CreateWishlist, GetWishList } from "./wishlist.model";
import { WishlistService } from "./wishlist.service";

export class wishlistController {
  static async createWishlist(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request = req.body as CreateWishlist;
       const userId = req.user?.id;

       if (!userId) throw new ErrorHandler(401, "User tidak terautentikasi");

      await logRequest(req, `POST /wishlist/create ${JSON.stringify(request)}`);

      const response = await WishlistService.createWishlist(request, userId);
      Wrapper.success(res, true, response, "Success create wishlist", 201);
    } catch (error) {
      next(error);
    }
  }

  static async getWishList(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: GetWishList = req.query as unknown as GetWishList;

      request.periode = Number(request.periode);
      request.page = Number(request.page);
      request.quantity = Number(request.quantity);

        await logRequest(req, `GET /wishlist/` + JSON.stringify(request));

        const response = await WishlistService.getWishlist(request);

        Wrapper.pagination(
            res,
            true,
            response.metaData,
            "Success get wishlist",
            response.data,
            200
        )
    } catch (error) {
        next(error);
    }
  }

  static async deleteWishlist(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request = req.params.id

      await logRequest(req, `DELETE /wishlist/delete ${JSON.stringify(request)}`);

      const response = await WishlistService.deleteWishlist({id: request});
      Wrapper.success(res, true, response, "Success delete wishlist", 200);
    } catch (error) {
      next(error);
    }
  }
}
