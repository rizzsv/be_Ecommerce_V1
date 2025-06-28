import { Validator } from "../../utils/validator.utils";
import {
    confirmOtp,
  createUser,
  getUser,
  login,
  requestOtp,
  toUserResponse,
  updateUser,
  UserResponse,
} from "./user.model";
import { userSchema } from "./user.schema";
import prisma from "../../config/prisma.config";
import loggerConfig from "../../config/logger.config";
import { ErrorHandler } from "../../config/custom.config";
import bcrypt from "bcrypt";
import { Jwt } from "../../helper/jwt.helper";
import { Crypto } from "../../helper/crypto.helper";
import { Role } from "@prisma/client";
import { MetaData } from "../../utils/type.utils";
import { CreateSecureOtp } from "../../utils/createOtp";
import { Nodemailer } from "../../helper/nodemailer/nodemailer.helper";

export class UserService {
  /** Login User */
  static async Login(req: login) {
    const ctx = "Login";
    const scp = "user";

    const userRequest = Validator.Validate(userSchema.login, req);

    const isUserExist = await prisma.user.findFirst({
      where: {
        AND: [
          {
            OR: [
              { username: userRequest.identity },
              { email: userRequest.identity },
            ],
          },
          {
            OR: [{ onDelete: false }],
          },
        ],
      },
    });

    if (!isUserExist) {
      loggerConfig.error(ctx, "User not found", scp);
      throw new ErrorHandler(400, "Akun belum terdaftar");
    }

    const isPasswordMatch = await bcrypt.compare(
      userRequest.password,
      isUserExist.password
    );

    if (!isPasswordMatch) {
      loggerConfig.error(ctx, "Invalid password", scp);
      throw new ErrorHandler(400, "Password anda salah");
    }

    const token = Jwt.createJwt({
      id: Crypto.encode(isUserExist.id),
      role: isUserExist.role,
      email: isUserExist.email,
      username: isUserExist.username,
    });

    return {
      token,
      role: isUserExist.role,
    };
  }

  /** Register User */
  static async addUser(req: createUser, userId?: string) {
    const ctx = "Register";
    const scp = "User";

    const userRequest = Validator.Validate(
      userId ? userSchema.createUserByAdmin : userSchema.registerUser,
      req
    );

    const isUserExist = await prisma.user.count({
      where: {
        OR: [{ email: userRequest.email }, { username: userRequest.username }],
      },
    });

    if (isUserExist !== 0) {
      loggerConfig.error(ctx, "User already regist", scp);
      throw new ErrorHandler(409, "Akun sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(userRequest.password, 10);

    const user = await prisma.user.create({
      data: {
        username: userRequest.username,
        email: userRequest.email,
        password: hashedPassword,
        phoneNum: userRequest.phoneNum,
        created_at: new Date(),
        role: userRequest.role || Role.USER,
      },
    });

    loggerConfig.info(ctx, `User created successfully`, scp);

    return {
      message: userId
        ? "User successfully added by admin"
        : "Registration successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        phoneNum: user.phoneNum,
      },
    };
  }

  /** Update User */
  static async updateUser(req: updateUser, role: Role) {
    const ctx = "Update User";
    const scp = "User";

    const userRequest = Validator.Validate(userSchema.updateUser, req);

    const existing = await prisma.user.findUnique({
      where: {
        id: req.id,
      },
    });

    if (!existing) {
      loggerConfig.error(ctx, "User Not Found", scp);
      throw new ErrorHandler(404, "User Tidak Ditemukan");
    }

    const updateData = {
      email: userRequest.email ?? existing.email,
      username: userRequest.username ?? existing.username,
      phoneNum: userRequest.phoneNum ?? existing.phoneNum,
    };

    //cek duplicate account
    const duplicate = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: req.id } },
          {
            OR: [
              { email: updateData.email },
              { username: updateData.username },
            ],
          },
        ],
      },
    });

    if (duplicate) {
      const fields = [];
      if (duplicate.username === updateData.username) fields.push("Username");
      if (duplicate.email === updateData.email) fields.push("Email");

      const message = `Duplicate found on: ${fields.join(", ")}`;
      loggerConfig.error(ctx, message, scp);
      throw new ErrorHandler(400, message);
    }

    if (role !== Role.ADMIN && "role" in req) {
      throw new ErrorHandler(403, "User tidak diizinkan mengubah role");
    }

    const updated = await prisma.user.update({
      where: { id: req.id },
      data: updateData,
    });

    return {};
  }

  /** Get All User */
  static async getAllUser(req: getUser) {
    const ctx = "Get All User";
    const scp = "User";

    const userRequest = Validator.Validate(userSchema.Get_User, req);

    const filters = {
      ...(userRequest.search && {
        OR: [
          {
            username: {
              contains: userRequest.search,
            },
          },
        ],
      }),
      ...(userRequest.role && { role: userRequest.role }),
      createdAt: {
        gte: new Date(`${userRequest.periode}-01-01T00:00:00.000Z`),
        lte: new Date(`${userRequest.periode}-12-31T23:59:59.999Z`),
      },
    };

    const [result, totalItem] = await Promise.all([
      prisma.user.findMany({
        where: filters,
        orderBy: {
          createdAt: "desc",
        },
        skip: (userRequest.page - 1) * userRequest.quantity,
        take: userRequest.quantity,
      }),
      prisma.user.count({
        where: filters,
      }),
    ]);

    if (result.length === 0) {
      loggerConfig.warn(ctx, "Data Not Found");
      throw new ErrorHandler(404, "Data tidak ditemukan");
    }

    const metaData: MetaData = {
      totalItem,
      currentPage: userRequest.page,
      totalPages: Math.ceil(totalItem / userRequest.quantity),
      quantity: userRequest.quantity,
    };

    loggerConfig.info(ctx, "Succes Get User", scp);

    return {
      data: await Promise.all(
        result.map(async (user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          phoneNum: user.phoneNum,
        }))
      ),
      metaData,
    };
  }

  /** Get User By Id */
  static async GetUserById(req: string): Promise<UserResponse> {
    const ctx = "Get User Id";
    const scp = "User";

    const userRequest = Validator.Validate(userSchema.Get_User_By_Id, {
      id: req,
    });

    const isUserExist = await prisma.user.findUnique({
      where: {
        id: userRequest.id,
      },
    });

    if (!isUserExist) {
      loggerConfig.error(ctx, "User Not Found", scp);
      throw new ErrorHandler(404, "User Tidak Ditemukan");
    }

    loggerConfig.info(ctx, "Succes Update User", scp);

    return toUserResponse(isUserExist);
  }

  static async DeleteUser(req: string) {
    const ctx = "Delete User";
    const scp = "User";

    const userRequest = Validator.Validate(userSchema.Get_User_By_Id, {
      id: req,
    });

    const isUserExist = await prisma.user.findUnique({
      where: {
        id: userRequest.id,
      },
    });

    if (!isUserExist) {
      loggerConfig.error(ctx, "User Not Found", scp);
      throw new ErrorHandler(404, "User Tidak Ditemukan");
    }

    await prisma.log.deleteMany({
      where: { userId: userRequest.id },
    });

    await prisma.user.delete({
      where: {
        id: userRequest.id,
      },
    });

    loggerConfig.info(ctx, "Succes Delete User", scp);

    return {};
  }

  static async requestOtp(req: requestOtp) {
    const ctx = "Request Otp";
    const scp = "User";

    const userRequest = Validator.Validate(userSchema.Request_Otp, req);

    const isUserExist = await prisma.user.findUnique({
      where: {
        email: userRequest.email,
        username: userRequest.username,
        phoneNum: userRequest.phoneNum,
      },
    });

    if (!isUserExist) {
      loggerConfig.error(ctx, "User Not Found", scp);
      throw new ErrorHandler(404, "User Tidak Ditemukan");
    }

    const otp = CreateSecureOtp();
    await prisma.otp.create({
        data: {
            email: isUserExist.email,
            code: otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        }
    })

    await Nodemailer.sendUserForgotPassword(isUserExist.email, otp);

    return {};
  }

  static async confirmOtp(req: confirmOtp){
    const ctx = 'Confirm OTP'
    const scp = 'User'

    const userRequest = Validator.Validate(userSchema.Confirm_Otp, req)

    const otpRecord = await prisma.otp.findFirst({
        where: {
            email: userRequest.email,
            code: userRequest.otp,
            expiresAt: {
                gte: new Date()
            }
        }
    })

    if(!otpRecord){
      loggerConfig.error(ctx, 'Invalid pr Expired OTP', scp)
      throw new ErrorHandler(400, 'OTP tidak valid')
    }

    loggerConfig.info(ctx, 'OTP verified successfully', scp)

    // first make otp and delete!
    await prisma.otp.delete({
        where: {id: otpRecord.id}
    })
    return
  }
}
