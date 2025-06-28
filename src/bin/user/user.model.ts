import { Role, User } from '@prisma/client';

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
    id: string
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

export interface userResponse {
    id: string,
    username: string,
    email: string,
    phoneNum: string,
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

export interface changePasswordUser {
  email: string
  password: string
}

export interface ChangePasswordAdmin {
  userId: string
  newPassword: string
}

export function toUserResponse(user: User): userResponse {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNum: user.phoneNum || '',
    }
}
