import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { createProduct, updateProduct } from "./product.model";
import { productSchema } from "./product.schema";
import loggerConfig from "../../config/logger.config";
import { ErrorHandler } from "../../config/custom.config";
import { removeFileIfExists } from "../../helper/delete.file.helper";

export class ProductService {
  static async createProduct(
    req: createProduct,
    userId: string,
    images: string[]
  ) {
    const ctx = "Create Product"
    const scp = "Product"
    const userRequest = Validator.Validate(productSchema.CreateProduct, req);

    const isProductExist = await prisma.product.count({
      where: {
        OR: [
          {name: userRequest.name},
        ]
      },
    });

    if(isProductExist !== 0) {
      loggerConfig.error(ctx, 'Product already regist')
      throw new ErrorHandler(409, "Product sudah terdaftar")
    }

    const create = await prisma.product.create({
      data: {
        userId,
        name: userRequest.name,
        description: userRequest.description,
        price: userRequest.price,
        stock: userRequest.stock,
        image: userRequest.image,
        category_id: userRequest.category,
        images: {
          create: images.map((url) => ({ url })),
        },
        variants: userRequest.variants
          ? { create: userRequest.variants }
          : undefined,
      },
      include: {
        images: true,
        variants: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    loggerConfig.info(ctx, `Product created successfully`, scp)

    return create;
  }

  static async updateProduct(req: updateProduct) {
    const ctx = "Update Product";
    const scp = "product";

    const userRequest = Validator.Validate(productSchema.UpdateProduct, req);

    const isProductExist = await prisma.product.findFirst({
      where: {
        id: userRequest.id,
      },
    });

    if (!isProductExist) {
      loggerConfig.error(ctx, "Product not found", scp);
      throw new ErrorHandler(404, "Product tidak ditemukan");
    }

    userRequest.category ??= isProductExist.category_id;
    userRequest.description ??= isProductExist.description;
    userRequest.price ??= isProductExist.price;
    userRequest.stock ??= isProductExist.stock;
    userRequest.image ??= isProductExist.image;
    userRequest.name ??= isProductExist.name;

    await prisma.product.update({
      where: {
        id: userRequest.id,
      },
      data: {
        category_id: userRequest.category,
        description: userRequest.description,
        price: userRequest.price,
        stock: userRequest.stock,
        image: userRequest.image,
        name: userRequest.name,
      },
    });

    if (userRequest.image !== isProductExist.image)
      removeFileIfExists(isProductExist.image);

    return {};
  }
}
