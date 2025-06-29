import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/custom.config";
import { createCategory } from "./category.model";
import { CategoryService } from "./category.service";
import { Wrapper } from "../../utils/wrapper.utils";
import { logRequest } from "../../helper/logger.request";


export class categoryController {
    static async createCategory(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: createCategory = req.body as createCategory

            await logRequest(req, `POST /category/create` + JSON.stringify(request));

            const response = await CategoryService.createCategory(request)
            Wrapper.success(res, true, response, 'Succes Create Category', 200)

        } catch (error) {
            next(error)
        }
    }
}