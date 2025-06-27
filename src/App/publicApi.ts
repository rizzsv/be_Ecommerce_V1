import express from 'express'
import { globalEnv } from '../utils/globalEnv.utils'
import { UserController } from '../bin/user/user.controller'
import { Jwt } from '../helper/jwt.helper'

export const publicApi = express.Router()

//login
publicApi.post(`${globalEnv.PREFIX}/login`, UserController.Login)

//regist
publicApi.post(`${globalEnv.PREFIX}/regist`, UserController.CreateUser)

/** Api Forget Password */
publicApi.post(
    `${globalEnv.PREFIX}/user/otp`,
    UserController.RequestOtp
)

/** api for user */

publicApi.put(
    `${globalEnv.PREFIX}/user`,
    Jwt.jwtValidator,
    UserController.UpdateUserByUser
)
