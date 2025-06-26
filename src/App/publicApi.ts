import express from 'express'
import { globalEnv } from '../utils/globalEnv.utils'
import { UserController } from '../bin/user/user.controller'

export const publicApi = express.Router()

//login
publicApi.post(`${globalEnv.PREFIX}/login`, UserController.Login)