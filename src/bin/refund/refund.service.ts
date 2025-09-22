import loggerConfig from "../../config/logger.config";
import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { refundModel } from "./refund.model";
import { refundSchema } from "./refund.schema";

export class RefundService {
    static async refundOrder(req: refundModel, userId: string) {
    const ctx = "Refund Order"
    const scp = "Refund"

    const userRequest = Validator.Validate(refundSchema.refundOrder, req)

    return await prisma.$transaction(async (tx) => {
        // cek apakah refund sudah ada
        const isRefundExist = await tx.refund.count({
            where: {
                order_id: userRequest.order_id,
                user_id: userId
            },
        });

        if (isRefundExist !== 0) {
            loggerConfig.error(ctx, "Refund already exists", scp);
            throw new Error("Refund sudah tersedia");
        }

        const isOrderExist = await prisma.order.findUnique({
            where: { id: userRequest.order_id },
            include: {
                orderItems: { // pastikan relasi ini sesuai model kamu
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!isOrderExist) {
            loggerConfig.error(ctx, "Order not found", scp);
            throw new Error("Order tidak ditemukan");
        }

        const refund = await prisma.refund.create({
            data: {
                user_id: userId,
                order_id: userRequest.order_id,
                reason: userRequest.reason,
                status: userRequest.status,
            }
        });

        for (const item of isOrderExist.orderItems) {
            await prisma.product.update({
                where: { id: item.product_id },
                data: {
                    stock: { increment: item.quantity }
                }
            });
        }

        await prisma.orderItem.deleteMany({
            where: { order_id: userRequest.order_id }
        });

        // baru hapus order
        await prisma.order.delete({
            where: { id: userRequest.order_id }
        });

        loggerConfig.info(ctx, "Refund created, order deleted, stock restored", scp);

        return refund;
    });
}

}