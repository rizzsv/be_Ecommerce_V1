import { Role } from '@prisma/client'
import express from 'express'
import { globalEnv } from '../utils/globalEnv.utils'
import { Jwt } from '../helper/jwt.helper'
import { UserController } from '../bin/user/user.controller'

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