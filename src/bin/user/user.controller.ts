import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/custom.config";
import { createUser, login, updateUser } from "./user.model";
import LoggerService from "../../config/logger.config";
import { UserService } from "./user.service";
import { Wrapper } from "../../utils/wrapper.utils";
import { logRequest } from "../../helper/logger.request";

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

    static async CreateUser(req: CustomRequest, res:Response, next: NextFunction): Promise<void> {
        const isAdmin = Boolean(req.user)
        const ctx = isAdmin ? 'Admin Add User' : 'User Registration'

        try {
            const request: createUser = req.body as createUser

            if (isAdmin){
               await logRequest(req, req.user ? 'POST /user' : 'POST /register')
            }

            const response = req.user ? await UserService.addUser(request, req.user.id) : await UserService.addUser(request)

            Wrapper.success(res, true, response, 'Success Create User', 201)
        } catch (error) {
            next(error)
        }
    }

    static async UpdateUserByAdmin(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: updateUser = req.body as updateUser

            const response = await UserService.updateUser(request, req.user!.role)
            Wrapper.success(res, true, response, 'Succes Updated User', 200)
        } catch (error) {
            next(error)
        }
    }

    static async UpdateUserByUser(req: CustomRequest, res: Response, next:NextFunction): Promise<void> {
        try {
            const request = {
                ...req.body,
                id: req.user!.id
            }

            const response = await UserService.updateUser(request, req.user!.role)
            Wrapper.success(res, true, response, 'Succes Update User', 200)
        } catch (error) {
            next(error)
        }
    }
}