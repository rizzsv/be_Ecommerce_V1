import { Role } from '@prisma/client'
import express from 'express'
import { globalEnv } from '../utils/globalEnv.utils'
import { Jwt } from '../helper/jwt.helper'
import { UserController } from '../bin/user/user.controller'
import { ProductController } from '../bin/product/product.controller'

import  upload  from '../helper/upload.helper'
import { categoryController } from '../bin/category/category.controller'
import { OrderController } from '../bin/order/order.controller'

export const privateApi = express.Router()

/** Role */
const roles = {
    ADMIN: Role.ADMIN,
    USER : Role.USER
}

/** Api User */

privateApi.post(`${globalEnv.PREFIX}/user`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),UserController.CreateUser)
privateApi.put(`${globalEnv.PREFIX}/user`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),UserController.UpdateUserByAdmin)
privateApi.get(`${globalEnv.PREFIX}/user`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),UserController.GetAllUser)
privateApi.get(`${globalEnv.PREFIX}/user/profile`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN, roles.USER),UserController.GetProfile)
privateApi.get(`${globalEnv.PREFIX}/user/:id`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),UserController.getUserById)
privateApi.delete( `${globalEnv.PREFIX}/user/:id`, Jwt.jwtValidator, Jwt.allowedRole(roles.ADMIN), UserController.DeleteUser)

/** Api Product */

privateApi.post(`${globalEnv.PREFIX}/product/create`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),upload.array('image', 5),ProductController.createProduct)
privateApi.put(`${globalEnv.PREFIX}/product/update`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),upload.array('image', 5),ProductController.updateProduct)
privateApi.get(`${globalEnv.PREFIX}/product`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN, roles.USER),ProductController.getAllProduct)
privateApi.get(`${globalEnv.PREFIX}/product/:id`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN, roles.USER),ProductController.getProductById)
privateApi.delete( `${globalEnv.PREFIX}/product/:id`, Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN), ProductController.deleteProduct)

/** Api Category */

privateApi.post(`${globalEnv.PREFIX}/category/create`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),categoryController.createCategory)
privateApi.put(`${globalEnv.PREFIX}/category/update`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),upload.none(),categoryController.updateCategory)
privateApi.get(`${globalEnv.PREFIX}/category`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN, roles.USER),categoryController.getCategory)
privateApi.get(`${globalEnv.PREFIX}/category/:id`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN, roles.USER),categoryController.getCategoryById)
privateApi.delete(`${globalEnv.PREFIX}/category/:id`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),categoryController.deleteCategory)

/** Api Order */

privateApi.put(`${globalEnv.PREFIX}/order/update-status`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),OrderController.updateOrderStatus)
privateApi.get(`${globalEnv.PREFIX}/order/:id`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),OrderController.getOrderById)
privateApi.get( `${globalEnv.PREFIX}/order`, Jwt.jwtValidator, Jwt.allowedRole(roles.ADMIN), OrderController.getAllOrders)
privateApi.delete(`${globalEnv.PREFIX}/order/:id`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),OrderController.deleteOrder)

// get Category By Slug
privateApi.get(`${globalEnv.PREFIX}/category/slug/:slug`,Jwt.jwtValidator,Jwt.allowedRole(roles.ADMIN),categoryController.getCategoryBySlug)

