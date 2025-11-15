import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { categorySchema } from "./category.schema";
import loggerConfig from "../../config/logger.config";
import { ErrorHandler } from "../../config/custom.config";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
} from "./category.model";

export class CategoryService {
  static async createCategory(req: createCategory) {
    const ctx = "Create Category";
    const scp = "Category";
    const userRequest = Validator.Validate(categorySchema.CreateCategory, req);

    const isCategoryExist = await prisma.category.count({
      where: {
        OR: [{ name: userRequest.name }, { slug: userRequest.slug }],
      },
    });

    if (isCategoryExist !== 0) {
      loggerConfig.error(ctx, "Category Already", scp);
      throw new ErrorHandler(409, "Category Sudah Tersedia");
    }

    const category = await prisma.category.create({
      data: {
        name: userRequest.name,
        slug: userRequest.slug,
      },
    });

    loggerConfig.info(ctx, "Category created succes", scp);

    return {
      id: category.id
    };
  }

  static async updateCategory(req: updateCategory) {
    const ctx = "Update Category";
    const scp = "Category";

    const userRequest = Validator.Validate(categorySchema.UpdateCategory, req);

    const isCategoryExist = await prisma.category.findFirst({
      where: {
        id: userRequest.id,
      },
    });

    if (!isCategoryExist) {
      loggerConfig.error(ctx, "Category not found", scp);
      throw new ErrorHandler(404, "Category tidak ditemukan");
    }

    userRequest.name ??= isCategoryExist.name;
    userRequest.slug ??= isCategoryExist.slug;

    await prisma.category.update({
      where: {
        id: userRequest.id,
      },
      data: {
        name: userRequest.name,
        slug: userRequest.slug,
      },
    });
    return {};
  }

  static async deleteCategory(req: deleteCategory) {
    const ctx = "Delete Category";
    const scp = "Category";

    const userRequest = Validator.Validate(categorySchema.DeleteCategory, req);

    const isCategoryExist = await prisma.category.findFirst({
      where: {
        id: userRequest.id,
      },
    });

    if (!isCategoryExist) {
      loggerConfig.error(ctx, "Category not found", scp);
      throw new ErrorHandler(404, "Category tidak ditemukan");
    }

    await prisma.category.delete({
      where: {
        id: userRequest.id,
      },
    });

    return {};
  }

  static async getCategoryById(req: getCategoryById) {
    const ctx = "Get Category By Id";
    const scp = "Category";

    const userRequest = Validator.Validate(
      categorySchema.GetCategoryById,
      req
    );

    const isCategoryExist = await prisma.category.findFirst({
      where: {
        id: userRequest.id,
      },
      include: {
        products: true, 
      },
    });

    if (!isCategoryExist) {
      loggerConfig.error(ctx, "Category not found", scp);
      throw new ErrorHandler(404, "Category tidak ditemukan");
    }

    return {
      id: isCategoryExist.id,
      name: isCategoryExist.name,
      slug: isCategoryExist.slug,
      createdAt: isCategoryExist.created_at,
      products: isCategoryExist.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        createdAt: product.created_at,
      })),
    };
  }


  static async getAllCategory(req: getCategory) {
    const ctx = "Get All Category";
    const scp = "Category";

    const userRequest = Validator.Validate(
      categorySchema.GetAllCategoryQuery,
      req
    );

    // Ensure periode is a valid number
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
      prisma.category.findMany({
        where: filter,
        orderBy: {
          created_at: "desc",
        },
        skip: (userRequest.page - 1) * userRequest.quantity,
        take: userRequest.quantity,
      }),
      prisma.category.count({
        where: filter,
      }),
    ]);

    if (result.length === 0) {
      loggerConfig.error(ctx, "Category not found", scp);
    }

    const metaData = {
      totalItem,
      totalPage: Math.ceil(totalItem / userRequest.quantity),
      currentPage: userRequest.page,
      perPage: userRequest.quantity,
    };

    loggerConfig.info(ctx, "Success get category data", scp);

    return {
      data: result.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        createdAt: item.created_at,
      })),
      metaData,
    };
  }

  static async getCategoryBySlug(req: getCategoryBySlug){
    const ctx = "Get Category By Slug";
    const scp = 'Category';

    const userRequest = Validator.Validate(
      categorySchema.GetCategoryBySlug, req
    );

    const isCategoryExist = await prisma.category.findFirst({
      where: {
        slug: userRequest.slug,
      },
    });

    if (!isCategoryExist) {
      loggerConfig.error(ctx, "Slug not found", scp);
      throw new ErrorHandler(404, "Slug tidak ditemukan");
    }

    loggerConfig.info(ctx, "Success get category by slug", scp);

    return {
      slug: isCategoryExist.slug
    }
  }
}
