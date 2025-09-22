import { Request, Response, NextFunction } from "express";
import { Wrapper } from "../../utils/wrapper.utils";
import { logRequest } from "../../helper/logger.request";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import { refundModel } from "./refund.model";
import { RefundService } from "./refund.service";

export class RefundController {
    static async refundOrder(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) : Promise<void> {
        try {
            const request: refundModel = req.body;
            const userId = req.user?.id;

            if (!userId) {
                throw new ErrorHandler(401, "User tidak terautentikasi");
            }

            await logRequest(req, `POST /refund/create ` + JSON.stringify(request));
            const result = await RefundService.refundOrder(request, userId);
            Wrapper.success(res, true, result, "Sukses membuat refund", 201);
        } catch (error) {
            next(error);
        }
    }
}