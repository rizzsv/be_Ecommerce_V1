import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/custom.config";
import { login } from "./user.model";
import LoggerService from "../../config/logger.config";
import { UserService } from "./user.service";
import { Wrapper } from "../../utils/wrapper.utils";

export class UserController {
    static async Login(req: CustomRequest, res: Response, next:NextFunction): Promise<void> {
        try {
            const request: login = req.body as login

            const response = await UserService.Login(request)
            Wrapper.success(res, true, response, 'Succes Login', 200)
        } catch (error) {
            next(error)
        }
    }
}