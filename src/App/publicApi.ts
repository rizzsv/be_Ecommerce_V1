import express from 'express'
import { globalEnv } from '../utils/globalEnv.utils'
import { UserController } from '../bin/user/user.controller'
import { Jwt } from '../helper/jwt.helper'
import { OrderController } from '../bin/order/order.controller'

export const publicApi = express.Router()

/** Login */
publicApi.post(`${globalEnv.PREFIX}/login`, UserController.Login)

/** Register */
publicApi.post(`${globalEnv.PREFIX}/regist`, UserController.CreateUser)

/** Api Forget Password */

// request otp
publicApi.post(
    `${globalEnv.PREFIX}/user/otp`,
    UserController.RequestOtp
)

// confirm otp
publicApi.post(
    `${globalEnv.PREFIX}/user/otp/confirm`,
    UserController.ConfirmOtp
)

/** api for user */

// edit profile
publicApi.put(
    `${globalEnv.PREFIX}/user`,
    Jwt.jwtValidator,
    UserController.UpdateUserByUser
)

// change password
publicApi.put(
    `${globalEnv.PREFIX}/user/change-password`,
    UserController.ChangePassword
)

/** Api for user order */
publicApi.post(
    `${globalEnv.PREFIX}/order`,
    Jwt.jwtValidator,
    OrderController.createOrder
)
