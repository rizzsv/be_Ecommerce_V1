import { Role } from '@prisma/client'
import express from 'express'
import { globalEnv } from '../utils/globalEnv.utils'
import { Jwt } from '../helper/jwt.helper'
import { UserController } from '../bin/user/user.controller'

export const privateApi = express.Router()

// Role
const roles = {
    ADMIN: Role.ADMIN,
    USER : Role.USER
}

// Create User
privateApi.post(
    `${globalEnv.PREFIX}/user`,
    Jwt.jwtValidator,
    Jwt.allowedRole(roles.ADMIN),
    UserController.CreateUser
)