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

// Create User
privateApi.post(
    `${globalEnv.PREFIX}/user`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    UserController.CreateUser
)

// Edit User
privateApi.put(
    `${globalEnv.PREFIX}/user`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    UserController.UpdateUserByAdmin
)

// Get User
privateApi.get(
    `${globalEnv.PREFIX}/user`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    UserController.GetAllUser
)

// Get Profile User
privateApi.get(
    `${globalEnv.PREFIX}/user/profile`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN, roles.USER),
    UserController.GetProfile
)

// Get User By Id
privateApi.get(
    `${globalEnv.PREFIX}/user/:id`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    UserController.getUserById
)

// Delete User
privateApi.delete(
    `${globalEnv.PREFIX}/user/:id`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    UserController.DeleteUser
)

/** Api Product */

// Create Product

privateApi.post(
    `${globalEnv.PREFIX}/product/create`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    upload.array('image', 5),
    ProductController.createProduct
)

// Update Product

privateApi.put(
    `${globalEnv.PREFIX}/product/update`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    upload.array('image', 5),
    ProductController.updateProduct
)

// Get All Product
privateApi.get(
    `${globalEnv.PREFIX}/product`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN, roles.USER),
    ProductController.getAllProduct
)

// Get Product By Id
privateApi.get(
    `${globalEnv.PREFIX}/product/:id`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN, roles.USER),
    ProductController.getProductById
)

// Delete Product
privateApi.delete(
    `${globalEnv.PREFIX}/product/:id`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    ProductController.deleteProduct
)

/** Api Category */

// create Category
privateApi.post(
   `${globalEnv.PREFIX}/category/create`,
   Jwt.jwtValidator,
   Jwt.allowedRole(roles.ADMIN),
   categoryController.createCategory
)

// update Category
privateApi.put(
    `${globalEnv.PREFIX}/category/update`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    upload.none(),
    categoryController.updateCategory
)

// get All Category
privateApi.get(
    `${globalEnv.PREFIX}/category`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    categoryController.getCategory
)

// delete Category
privateApi.delete(
    `${globalEnv.PREFIX}/category/:id`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    categoryController.deleteCategory
)

/** Api Order */
// update Order Status
privateApi.put(
    `${globalEnv.PREFIX}/order/update-status`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    OrderController.updateOrderStatus
)

// getOrder By Id
privateApi.get(
    `${globalEnv.PREFIX}/order/:id`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    OrderController.getOrderById
)

// get All Orders
privateApi.get(
    `${globalEnv.PREFIX}/order`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    OrderController.getAllOrders
)

// delete Order
privateApi.delete(
    `${globalEnv.PREFIX}/order/:id`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    OrderController.deleteOrder
)



// get Category By Slug
privateApi.get(
    `${globalEnv.PREFIX}/category/:slug`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    categoryController.getCategoryBySlug
)

