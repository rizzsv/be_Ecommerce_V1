import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductById,
  updateProduct,
  VariantInput,
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

    if (typeof req.variants === "string") {
  try {
    req.variants = JSON.parse(req.variants);
  } catch (err) {
    throw new ErrorHandler(400, "Format variants tidak valid (harus JSON array)");
  }
}


    const userRequest = Validator.Validate(productSchema.UpdateProduct, req);

    const isProductExist = await prisma.product.findFirst({
      where: { id: userRequest.id },
      select: {
        variants: true,
        status: true,
        category_id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        image: true,
      }
    });

    if (!isProductExist) {
      loggerConfig.error(ctx, "Product not found", scp);
      throw new ErrorHandler(404, "Product tidak ditemukan");
    }

    userRequest.category_id =
      userRequest.category_id ??
      userRequest.category ??
      isProductExist.category_id;
    userRequest.description ??= isProductExist.description;
    userRequest.price ??= isProductExist.price;
    if (typeof userRequest.stock !== "number") {
      userRequest.stock = isProductExist.stock;
    }
    userRequest.status ??= isProductExist.status;
    userRequest.image ??= isProductExist.image;
    userRequest.name ??= isProductExist.name;


    const status = userRequest.stock === 0 ? "Sold Out" : "Available";

    await prisma.product.update({
      where: { id: userRequest.id },
      data: {
        name: userRequest.name,
        description: userRequest.description,
        price: userRequest.price,
        stock: userRequest.stock,
        image: userRequest.image,
        category_id: userRequest.category_id,
        status,
        variants: userRequest.variants
          ? {
            deleteMany: {}, // Hapus semua variant lama
            create: userRequest.variants.map((variant: VariantInput) => ({
              color: variant.color,
              size: variant.size,
              stock: variant.stock,
              status: variant.stock === 0 ? "Sold Out" : "Available",
            })),
          }
          : undefined,
      },
    });

    if (userRequest.image !== isProductExist.image) {
      removeFileIfExists(isProductExist.image);
    }

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
      where: { productId: userRequest.id }
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
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        category_id: true,
        stock: true,
        status: true,
        category: {
          select: {
            name: true,
          },
        },
        variants: true,
        images: {
          select: {
            url: true,
          },
        },
        created_at: true,
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
      categoryId: isProductExist.category_id,
      categoryName: isProductExist.category?.name,
      stock: isProductExist.stock,
      status: isProductExist.status,
      variants: isProductExist.variants,
      images: isProductExist.images.map((img) => img.url),
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
        include: {
          category: true,
          variants: true,
          images: true,
        }
      }),
      prisma.product.count({
        where: filter,
      }),

    ])

    if (result.length === 0) {
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
        categoryId: item.category_id,
        categoryName: item.category?.name,
        variants: item.variants,
        images: item.images.map((img) => img.url),
        createdAt: item.created_at
      })),
      metaData,
    }
  }
}
