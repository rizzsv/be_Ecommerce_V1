import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import loggerConfig from "../../config/logger.config";
import { ErrorHandler } from "../../config/custom.config";
import { createRating, deleteRating, getRatingByProduct, updateRating } from "./rating.model";
import { rattingSchema } from "./rating.schema";

export class RatingService {
    static async createRating(req: createRating, userId: string) {
        const ctx = "Create rating";
        const scp = "Rating";

        const userRequest = Validator.Validate(rattingSchema.CreateRating, req);

        const existingRating = await prisma.ratingProduct.findFirst({
            where: {
                user_id: userRequest.user_id,
                product_id: userRequest.product_id,
            },
        });

        if (existingRating) {
            loggerConfig.error(ctx, "You have already rated this product", scp);
            throw new ErrorHandler(400, "Kamu sudah memberikan rating untuk produk ini");
        }

        const ratingProduct = await prisma.ratingProduct.create({
            data: {
                user_id: userId,
                product_id: userRequest.product_id,
                messageRating: userRequest.messageRating,
                review: userRequest.review,
            },
        });

        loggerConfig.info(ctx, "Rating created successfully", scp);
        return {
            ...ratingProduct
        };
    }

    static async updateRating(req: updateRating, userId: string) {
        const ctx = "Update Rating";
        const scp = "Rating";

        const userRequest = Validator.Validate(rattingSchema.UpdateRating, req);

        const rating = await prisma.ratingProduct.findFirst({
            where: { user_id: userId, product_id: userRequest.product_id },
        });

        if (!rating) {
            loggerConfig.error(ctx, "Rating not found", scp);
            throw new ErrorHandler(404, "rating tidak ditemukan");
        }

        await prisma.ratingProduct.update({
            where: { id: rating.id },
            data: {
                messageRating: userRequest.messageRating,
                review: userRequest.review,
            },
        });

        loggerConfig.info(ctx, "Rating updated successfully", scp);
        return {};
    }

    static async getRatingByProduct(req: getRatingByProduct) {
    const ctx = "Get Rating By Product";
    const scp = "Rating";

    const userRequest = Validator.Validate(rattingSchema.GetRatingByProduct, req);

    const ratingExists = await prisma.ratingProduct.findFirst({
        where: { id: userRequest.id },
    });

    if (!ratingExists) {
        loggerConfig.error(ctx, "Rating not found", scp);
        throw new ErrorHandler(404, "rating tidak ditemukan");
    }

    const ratings = await prisma.ratingProduct.findFirst({
        where: { 
            id: userRequest.id,
        },
        include: {
            user: {
                select: {
                    username: true,
                }
            }
        }
    });

    if (!ratings) {
        loggerConfig.error(ctx, "Rating not found", scp);
        throw new ErrorHandler(404, "rating tidak ditemukan");
    }

    loggerConfig.info(ctx, "Rating retrieved successfully", scp);

    return {
        ...ratings
    };
}


    static async deleteRating(req: deleteRating, userId: string) {
        const ctx = "Delete Rating";
        const scp = "Rating";

        const userRequest = Validator.Validate(rattingSchema.DeleteRating, req);

        const rating = await prisma.ratingProduct.findUnique({
            where: { id: userRequest.id },
        });

        if (!rating) {
            loggerConfig.error(ctx, "Rating not found", scp);
            throw new ErrorHandler(404, "rating tidak ditemukan");
        }

        await prisma.ratingProduct.delete({
            where: { id: userRequest.id, user_id: userId },
        });

        loggerConfig.info(ctx, "Rating deleted successfully", scp);
        return {};
    }
}