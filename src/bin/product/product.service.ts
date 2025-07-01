import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductById,
  updateProduct,
} from "./product.model";
import { productSchema } from "./product.schema";
import loggerConfig from "../../config/logger.config";
import { ErrorHandler } from "../../config/custom.config";
import { removeFileIfExists } from "../../helper/delete.file.helper";

export class ProductService {
  static async createProduct(req: createProduct, images: string[]) {
    const ctx = "Create Product";
    const scp = "Product";
    const userRequest = Validator.Validate(productSchema.CreateProduct, req);

    const isProductExist = await prisma.product.count({
      where: {
        OR: [{ name: userRequest.name }],
      },
    });

    if (isProductExist !== 0) {
      loggerConfig.error(ctx, "Product already regist");
      throw new ErrorHandler(409, "Product sudah terdaftar");
    }

    const create = await prisma.product.create({
      data: {
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
      },
    });

    loggerConfig.info(ctx, `Product created successfully`, scp);

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

  static async deleteProduct(req: deleteProduct) {
    const ctx = "Delete Product";
    const scp = "product";

    const userRequest = Validator.Validate(productSchema.DeleteProduct, req);

    const isProductExist = await prisma.product.findFirst({
      where: {
        id: userRequest.id,
      },
    });

    if (!isProductExist) {
      loggerConfig.error(ctx, "Product not found", scp);
      throw new ErrorHandler(404, "Prouct tidak ditemukan");
    }

    await prisma.productImage.deleteMany({
      where: {productId: userRequest.id}
    })

    await prisma.product.delete({
      where: {
        id: userRequest.id,
      },
    });

    removeFileIfExists(isProductExist.image);

    return {};
  }

  static async getProductById(req: getProductById) {
    const ctx = "Get Product By Id";
    const scp = "product";

    const userRequest = Validator.Validate(productSchema.GetByIdProduct, req);

    const isProductExist = await prisma.product.findFirst({
      where: {
        id: userRequest.id,
      },
    });

    if (!isProductExist) {
      loggerConfig.error(ctx, "Product not found", scp);
      throw new ErrorHandler(404, "Product tidak ditemukan");
    }

    return {
      id: isProductExist.id,
      name: isProductExist.name,
      description: isProductExist.description,
      price: isProductExist.price,
      image: isProductExist.image,
      category: isProductExist.category_id,
      createdAt: isProductExist.created_at,
    };
  }

  static async getProductAll(req: getProduct) {
    const ctx = "Get Product All";
    const scp = "product";

    const userRequest = Validator.Validate(productSchema.GetAllProduct, req);

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
    }

    const [result, totalItem] = await Promise.all([
      prisma.product.findMany({
        where: filter,
        orderBy: {
          created_at: 'desc'
        },
        skip: (userRequest.page - 1) * userRequest.quantity,
        take: userRequest.quantity,
      }),
      prisma.product.count({
        where: filter
      }),
    ])

    if(result.length === 0) {
      loggerConfig.info(ctx, 'No products found', scp);
      throw new ErrorHandler(404, 'Tidak ada produk ditemukan');
    }

    const metaData = {
      totalItem,
      currentPage: userRequest.page,
      quantity: userRequest.quantity,
       totalPages: Math.ceil(totalItem / userRequest.quantity),
    }

    loggerConfig.info(ctx, 'Success get product data', scp)

    return {
      data: result.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category: item.category_id,
        createdAt: item.created_at
      })),
      metaData,
    }
  }
}
