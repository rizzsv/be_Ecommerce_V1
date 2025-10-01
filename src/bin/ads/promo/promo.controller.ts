import { Request, Response, NextFunction } from "express";
import { addPromo } from "./promo.model";
import { logRequest } from "../../../helper/logger.request";
import { PromoService } from "./promo.service";
import { Wrapper } from "../../../utils/wrapper.utils";

export class PromoController {
    static async addPromo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: addPromo = req.body;

            await logRequest(req, `POST /promo/add ${JSON.stringify(request)}`);

            const result = await PromoService.addPromo(request);

            Wrapper.success(res, true, result, "Sukses membuat promo", 201);
        } catch (error) {
            next(error);
        }
    }
}