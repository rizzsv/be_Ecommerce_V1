import { NextFunction, Response } from "express";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import { changePasswordUser, confirmOtp, createUser, getUser, login, requestOtp, updateUser } from "./user.model";
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
            Wrapper.success(res, true, response, 'Succes Updated User From Admin', 200)
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
            Wrapper.success(res, true, response, 'Succes Updated User', 200)
        } catch (error) {
            next(error)
        }
    }

    static async GetAllUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
        const request: getUser = req.query as unknown as getUser

        request.periode = Number(request.periode)
        request.page = Number(request.page)
        request.quantity = Number(request.quantity)

       await logRequest(req, `GET /user/` + JSON.stringify(request));

        const response = await UserService.getAllUser(request)
        Wrapper.pagination(res, true, response.metaData, 'Succes Get User', response.data, 200)
        } catch (error) {
            next(error)
        }
    }

    static async getUserById(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request = req.params.id

            await logRequest(req, `GET /user/${request}`)

            const response= await UserService.GetUserById(request)
            Wrapper.success(res, true, response, 'Succes Get User', 200)
        } catch (error) {
            next(error)
        }
    }

    static async DeleteUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request = req.params.id

            await logRequest(req, `DELETE /user/${request}`)

            const response = await UserService.DeleteUser(request)
            Wrapper.success(res, true, response, 'Success Delete User', 200)
        } catch (error) {
            next(error)
        }
    }

    static async RequestOtp(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: requestOtp = req.body as requestOtp

            await logRequest(req, `POST /user/otp/${request}`)

            const response = await UserService.requestOtp(request)
            Wrapper.success(res, true, response, 'Success send otp', 200)
        } catch (error) {
            next(error)
        }
    }

    static async ConfirmOtp(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: confirmOtp = req.body as confirmOtp

            await logRequest(req, `POST /user/otp/confirm`)

            const response = await UserService.confirmOtp(request)
            Wrapper.success(res, true, response, 'Success confirm otp', 200)
        } catch (error) {
            next(error)
        }
    }

static async ChangePassword(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await logRequest(req, `PUT /user/change-password`);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ErrorHandler(401, "Authorization header missing or invalid");
    }

    const token = authHeader.split(" ")[1];

    const { password } = req.body;

    if (!password) {
      throw new ErrorHandler(400, "Password is required");
    }

    const response = await UserService.changePassword(password, token);

    Wrapper.success(res, true, response, "Success change password", 200);
  } catch (error) {
    next(error);
  }
}

}