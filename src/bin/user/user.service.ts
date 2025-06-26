import { Validator } from "../../utils/validator.utils";
import { login } from "./user.model";
import { userSchema } from "./user.schema";
import prisma from '../../config/prisma.config'
import loggerConfig from '../../config/logger.config'
import { ErrorHandler } from "../../config/custom.config";
import bcrypt from 'bcrypt'
import {Jwt} from '../../helper/jwt.helper'
import {Crypto} from '../../helper/crypto.helper'
import { Role } from "@prisma/client";

export class UserService {
    static async Login(req: login){
        const ctx = 'Login'
        const scp = 'user'

        const userRequest = Validator.Validate(userSchema.login, req)

        const isUserExist = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: userRequest.identity},
                    {username: userRequest.identity}
                ],
            },
        })

        if (!isUserExist) {
            loggerConfig.error(ctx, 'User not found', scp)
            throw new ErrorHandler(400, 'Akun belum terdaftar')
        }

        const isPasswordMatch = await bcrypt.compare(userRequest.password, isUserExist.password)

        if(!isPasswordMatch) {
            loggerConfig.error(ctx, 'Invalid password', scp)
            throw new ErrorHandler(400, 'Password anda salah')
        }

        const token = Jwt.createJwt({
            id: Crypto.encode(isUserExist.id),
            role: isUserExist.role,
            email: isUserExist.email,
            username: isUserExist.username,
        })

        return {
            token,
            role: isUserExist.role
        }
    } 
}