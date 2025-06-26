import { Validator } from "../../utils/validator.utils";
import { createUser, login } from "./user.model";
import { userSchema } from "./user.schema";
import prisma from '../../config/prisma.config'
import loggerConfig from '../../config/logger.config'
import { ErrorHandler } from "../../config/custom.config";
import bcrypt from 'bcrypt'
import {Jwt} from '../../helper/jwt.helper'
import {Crypto} from '../../helper/crypto.helper'
import { Role } from "@prisma/client";

export class UserService {

    /** Login User */
    static async Login(req: login){
        const ctx = 'Login'
        const scp = 'user'

        const userRequest = Validator.Validate(userSchema.login, req)

        const isUserExist = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: userRequest.identity},
                    {username: userRequest.identity},
                    {phoneNum: userRequest.identity}
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

    /** Register User */
    static async addUser(req: createUser, userId?: string){
        const ctx = 'Register'
        const scp = 'User'

        const userRequest = Validator.Validate(userId ? userSchema.createUserByAdmin : userSchema.registerUser, req)

        const isUserExist = await prisma.user.count({
            where: {
                OR: [
                    {email: userRequest.email},
                    {username: userRequest.username},
                ]
            },
        })

        if (isUserExist !== 0){
            loggerConfig.error(ctx, 'User already regist', scp)
            throw new ErrorHandler(409, 'Akun sudah terdaftar')
        }

        const user = await prisma.user.create({
            data: {
                username: userRequest.username,
                email: userRequest.email,
                password: userRequest.password,
                phoneNum: userRequest.phoneNum,
                role: userRequest.role || Role.USER,
            },
        })

        loggerConfig.info(ctx, `User created successfully`, scp)

        return {
            message: userId ? 'User successfully added by admin' : 'Registration successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                phoneNum: user.phoneNum,
            }
        }
    }
}