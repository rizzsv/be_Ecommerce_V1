import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import loggerConfig from "../../config/logger.config";
import { ErrorHandler } from "../../config/custom.config";
import { createCart, deleteCart, getCart, updateCart } from "./cart.model";
import { cartSchema } from "./cart.schema";

export class CartService {
  static async createCart(req: createCart) {
  const ctx = "Create cart";
  const scp = "Cart";

  const userRequest = Validator.Validate(cartSchema.CreateCart, req);

  for (const item of userRequest.product) {
    const isCartExist = await prisma.cartItem.findFirst({
      where: {
        user_id: userRequest.user_id,
        product_id: item.product_id,
      },
    });

    if (isCartExist) {
      await prisma.cartItem.update({
        where: { id: isCartExist.id },
        data: {
          quantity: isCartExist.quantity + item.quantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          user_id: userRequest.user_id,
          product_id: item.product_id,
          quantity: item.quantity,
        },
      });
    }
  }

  loggerConfig.info(ctx, "Cart created successfully", scp);
  return {};
}


static async updateCart(req: updateCart) {
  const ctx = "Update cart";
  const scp = "Cart";

  const userRequest = Validator.Validate(cartSchema.UpdateCart, req);

  for (const item of userRequest.product) {
    const cart = await prisma.cartItem.findFirst({
      where: {
        id: userRequest.id,
        product_id: item.productId,
        user_id: req.userId, // asumsi userId dikirim dari middleware atau req.user
      },
    });

    if (!cart) {
      loggerConfig.error(ctx, `Cart not found for product ${item.productId}`, scp);
      continue; // skip jika tidak ditemukan, atau throw kalau perlu
    }

    await prisma.cartItem.update({
      where: { id: cart.id },
      data: {
        quantity: item.quantity,
      },
    });
  }

  loggerConfig.info(ctx, "Cart updated successfully", scp);
  return {};
}


  static async getCart(req: getCart) {
    const ctx = "Get all cart";
    const scp = "Cart";

    const userRequest = Validator.Validate(cartSchema.GetAllCartQuery, req);

    if (!userRequest.periode || isNaN(userRequest.periode)) {
      userRequest.periode = new Date().getFullYear();
    }

    const filter = {
      ...(userRequest.search && {
        name: {
          contains: userRequest.search,
        },
      }),
      created_at: {
        gte: new Date(`${userRequest.periode}-01-01T00:00:00.000Z`),
        lte: new Date(`${userRequest.periode}-12-31T23:59:59.999Z`),
      },
    };

    const [result, totalItem] = await Promise.all([
      prisma.cartItem.findMany({
        where: filter,
        orderBy: {
          created_at: "desc",
        },
        skip: (userRequest.page - 1) * userRequest.quantity,
        take: userRequest.quantity,
      }),
      prisma.cartItem.count({
        where: filter,
      }),
    ]);

    if (result.length === 0) {
      loggerConfig.error(ctx, "Cart not found", scp);
    }

    const metaData = {
        totalItem,
        totalPage: Math.ceil(totalItem / userRequest.quantity),
        currentPage: userRequest.page,
        perPage: userRequest.quantity,
    };

    loggerConfig.info(ctx, "Success get cart data", scp);

    return {
        data: result.map((cart) => ({
            id: cart.id,
            user_id: cart.user_id,
            product_id: cart.product_id,
            quantity: cart.quantity,
            created_at: cart.created_at,
        })),
        metaData,
    };
  }

  static async deleteCart(req: deleteCart){
    const ctx = "Delete cart";
    const scp = "Cart";

    const userRequest = await Validator.Validate(
        cartSchema.DeleteCart, req
    );

    const cart = await prisma.cartItem.findFirst({
      where: {
        id: userRequest.id,
      },
    });

    if (!cart) {
      loggerConfig.error(ctx, "Cart not found", scp);
      throw new ErrorHandler(404, "Cart not found");
    }

    await prisma.cartItem.delete({
      where: {
        id: userRequest.id,
      },
    });

    loggerConfig.info(ctx, "Cart deleted successfully", scp);

    return {};
  }
}
