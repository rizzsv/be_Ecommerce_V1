import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { ErrorHandler } from "../../config/custom.config";
import { wishlistSchema } from "./wishlist.schema";
import { CreateWishlist, DeleteWishlist, GetWishList } from "./wishlist.model";
import loggerConfig from "../../config/logger.config";

export class WishlistService {
  static async  createWishlist(req: CreateWishlist, userId: string) {
    const ctx = "Create wishlist";
    const scp = "Wishlist";

    const userRequest = Validator.Validate(wishlistSchema.CreateWishlist, req);

    const isWishlistExist = await prisma.wishlist.count({
      where: {
        product_id: userRequest.product_id,
        user_id: userId 
      },
    });

    if (isWishlistExist !== 0) {
      loggerConfig.error(ctx, "Wishlist already exists", scp);
      throw new ErrorHandler(409, "Wishlist sudah tersedia");
    }

    const create = await prisma.wishlist.create({
      data: {
        product_id: userRequest.product_id,
        user_id: userId,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            image: true,
          }
        }
      }
    });

    loggerConfig.info(ctx, "Wishlist created successfully", scp);

    return{
      id: create.id,
      product_id: create.product_id,
      user_id: create.user_id,
      created_at: create.created_at,
      product: create.product
    }
  }

  static async getWishlist(req: GetWishList) {
    const ctx = "Get wishlist";
    const scp = "Wishlist";

    const userRequest = Validator.Validate(wishlistSchema.GetWishlist, req);

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
      prisma.wishlist.findMany({
        where: filter,
        orderBy: {
          created_at: "desc",
        },
        skip: (userRequest.page - 1) * userRequest.quantity,
        take: userRequest.quantity,
      }),
      prisma.wishlist.count({
        where: filter
      }),
    ]);

    if(result.length === 0) {
        loggerConfig.error(ctx, "Wishlist not found", scp);
        throw new ErrorHandler(404, "Wishlist tidak ditemukan");
    }

    const metaData = {
        totalItem,
        totalPage: Math.ceil(totalItem / userRequest.quantity),
        currentPage: userRequest.page,
        quantity: userRequest.quantity,
    }

    loggerConfig.info(ctx, "Wishlist retrieved successfully", scp);

    return {
        data: result.map((item) => ({
            id: item.id,
            product_id: item.product_id,
            user_id: item.user_id,
            created_at: item.created_at,
        })),
        metaData
    }
  }

  static async deleteWishlist(req: DeleteWishlist) {
    const ctx = "Delete wishlist";
    const scp = "Wishlist";

    const userRequest = Validator.Validate(wishlistSchema.DeleteWishlist, req);

    const isWishlistExist = await prisma.wishlist.findFirst({
        where: {
            id: userRequest.id,
        },
    });

    if (!isWishlistExist) {
      loggerConfig.error(ctx, "Wishlist not found", scp);
      throw new ErrorHandler(404, "Wishlist tidak ditemukan");
    }
    await prisma.wishlist.delete({
      where: {id: userRequest.id},
    });

    loggerConfig.info(ctx, "Wishlist deleted successfully", scp);

    return{}
  }
}
