import express from 'express'
import { globalEnv } from '../utils/globalEnv.utils'
import { UserController } from '../bin/user/user.controller'
import { Jwt } from '../helper/jwt.helper'
import { OrderController } from '../bin/order/order.controller'
import { CartController } from '../bin/Cart/cart.controller'

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

/** Api for cart */
publicApi.post(
    `${globalEnv.PREFIX}/cart`,
    Jwt.jwtValidator,
    CartController.createCart
)


publicApi.put(
    `${globalEnv.PREFIX}/cart`,
    Jwt.jwtValidator,
    CartController.updateCart
)


publicApi.get(
    `${globalEnv.PREFIX}/cart`,
    Jwt.jwtValidator,
    CartController.getCart
)

publicApi.delete(
    `${globalEnv.PREFIX}/cart/:id`,
    Jwt.jwtValidator,
    CartController.deleteCart
)