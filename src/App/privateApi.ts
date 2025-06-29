import { Role } from '@prisma/client'
import express from 'express'
import { globalEnv } from '../utils/globalEnv.utils'
import { Jwt } from '../helper/jwt.helper'
import { UserController } from '../bin/user/user.controller'
import { ProductController } from '../bin/product/product.controller'

import  upload  from '../helper/upload.helper'
import { categoryController } from '../bin/category/category.controller'

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

/** Api Category */
privateApi.post(
   `${globalEnv.PREFIX}/category/create`,
   Jwt.jwtValidator,
   Jwt.allowedRole(roles.ADMIN),
   categoryController.createCategory
)

/** Api Product */
privateApi.post(
    `${globalEnv.PREFIX}/product/create`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    upload.array('image', 5),
    ProductController.createProduct
)
