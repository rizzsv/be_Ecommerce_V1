import { Role } from '@prisma/client';

export interface login {
    identity: string
    password: string

}

export interface createUser {
    username: string
    email: string
    password: string
    phoneNum: string
    role?: Role
}

export interface updateUser {
    username?: string
    email?: string
    password?: string
    role?: Role
}

export interface getUser {
    search?: string
    role: Role
    periode: number
    page: number
    quantity: number
}

export interface login {
    username: string
    password: string
}

export interface requestOtp {
    email: string
}

export interface confirmOtp {
    email: string
    otp: string
}

export interface ChangePasswordUser {
  oldPassword: string
  newPassword: string
}

export interface ChangePasswordAdmin {
  userId: string
  newPassword: string
}
