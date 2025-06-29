import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { categorySchema } from "./category.schema";
import loggerConfig from "../../config/logger.config";
import { ErrorHandler } from "../../config/custom.config";
import { createCategory } from "./category.model";

export class CategoryService {
    static async createCategory( req: createCategory) {
        const ctx = 'Create Category'
        const scp = 'Category'
        const userRequest = Validator.Validate(categorySchema.CreateCategory, req);

        const isCategoryExist = await prisma.category.count({
            where: {
                OR: [{name: userRequest.name}, {slug: userRequest.slug}]
            }
        })

        if(isCategoryExist !== 0 ) {
            loggerConfig.error(ctx, "Category Already", scp);
            throw new ErrorHandler(409, 'Category Sudah Tersedia')
        }
        
        const category = await prisma.category.create({
            data: {
                name: userRequest.name,
                slug: userRequest.slug
            }
        });

        loggerConfig.info(ctx, 'Category created succes', scp);

        return{
            category
        }
    }
}