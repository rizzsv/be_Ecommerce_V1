import { Request, Response, NextFunction } from "express";
import { Wrapper } from "../../utils/wrapper.utils";
import { logRequest } from "../../helper/logger.request";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import { refundModel, updateRefundStatus } from "./refund.model";
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

    static async getRefundById(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const request = req.params.id;

            await logRequest(req, `GET /refund/getById ${JSON.stringify(request)}`);

            const response = await RefundService.getRefundByUser({id: request})
            Wrapper.success(res, true, response, "Sukses mendapatkan refund", 200);
        } catch (error) {
            next(error);
        }
    }

    static async updateRefundStatus(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const request = req.body as updateRefundStatus

            await logRequest(req, `PUT /refund/update-status ${JSON.stringify(request)}`);

            const response = await RefundService.updateStatusRefund(request)
            Wrapper.success(res, true, response, 'Sukses mengupdate status refund', 200);
        } catch (error) {
            next(error);
        }
    }
}