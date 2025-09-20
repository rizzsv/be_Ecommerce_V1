import { Request, Response, NextFunction } from "express";
import { Wrapper } from "../../utils/wrapper.utils";
import { logRequest } from "../../helper/logger.request";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import { createRating, getRatingByProduct, updateRating } from "./rating.model";
import { RatingService } from "./rating.service";

export class RattingController {
    static async createRating(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) : Promise<void> {
        try {
            const request: createRating = req.body;
            const userId = req.user?.id;

            if (!userId) {
                throw new ErrorHandler(401, "User tidak terautentikasi");
            }

            await logRequest(req, `POST /rating/create ` + JSON.stringify(request));
            const result = await RatingService.createRating(request, userId);
            Wrapper.success(res, true, result, "Sukses membuat rating", 201);
        } catch (error) {
            next(error);
        }
    }

    static async updateRating (
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) : Promise<void> {
        try {
            const request: updateRating = req.body as updateRating;
            const userId = req.user?.id;

            if (!userId) {
                throw new ErrorHandler(401, "User tidak terautentikasi");
            }
            await logRequest(req, `PUT /rating/update ` + JSON.stringify(request));
            const result = await RatingService.updateRating(request, userId);
            Wrapper.success(res, true, result, "Sukses mengupdate rating", 200);
        } catch (error) {
            next(error);
        }
    }

    static async getRatingByProduct(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) : Promise<void> {
        try {
            const request = req.params.id;
            const userId = req.user?.id;

            if (!userId) {
                throw new ErrorHandler(401, "User tidak terautentikasi");
            }
            await logRequest(req, `GET /rating/product ` + JSON.stringify(request));
            const result = await RatingService.getRatingByProduct({product_id: request});
            Wrapper.success(res, true, result, "Sukses mendapatkan rating", 200);
        } catch (error) {
            next(error);
        }
    }
}