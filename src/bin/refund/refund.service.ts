import loggerConfig from "../../config/logger.config";
import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { refundStatus } from "@prisma/client";
import { getRefundId, refundModel, updateRefundStatus } from "./refund.model";
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
                orderItems: {
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

        // buat refund request dengan status awal PENDING
        const refund = await prisma.refund.create({
            data: {
                user_id: userId,
                order_id: userRequest.order_id,
                reason: userRequest.reason,
                status: refundStatus.PENDING, // default pending
            }
        });

        // update status order jadi REFUND_REQUESTED / REFUND_PENDING
        await tx.order.update({
            where: { id: userRequest.order_id },
            data: { status: refundStatus.PENDING }
        });

        loggerConfig.info(ctx, "Refund created, waiting for approval", scp);

        return refund;
    });
}

    static async getRefundByUser(req: getRefundId) {
        const ctx = "Get Refund By User"
        const scp = "Refund"

        const userRequest = Validator.Validate(refundSchema.getRefundId, req);

        const isRefundExist = await prisma.refund.findFirst({
            where: {
                id: userRequest.refund_id,
            },
        });

        if (!isRefundExist) {
            loggerConfig.error(ctx, "Refund not found", scp);
            throw new Error("Refund tidak ditemukan");
        }

        const refund = await prisma.refund.findFirst({
            where: {
                id: userRequest.refund_id,
                user_id: userRequest.user_id
            }, include: {
                user: {
                    select: {
                        username: true,
                        phoneNum: true,
                    },
                },
                order: {
                    select: {
                        id: true,
                        total_amount: true,
                        shipping_address: true,
                    }
                }
            }
        });

        if (!refund) {
            loggerConfig.error(ctx, "Refund not found", scp);
            throw new Error("Refund tidak ditemukan");
        }

        loggerConfig.info(ctx, "Refund retrieved successfully", scp);

        return {
            ...refund
        }
    }

    static async updateStatusRefund(req: updateRefundStatus, status: refundStatus) {
    const ctx = "Update Refund Status"
    const scp = "Refund"

    return await prisma.$transaction(async (tx) => {
        const refund = await prisma.refund.findUnique({
            where: { id: req.refund_id },
            include: {
                order: {
                    include: { orderItems: true }
                }
            }
        });

        if (!refund) {
            loggerConfig.error(ctx, "Refund not found", scp);
            throw new Error("Refund tidak ditemukan");
        }

        const updatedRefund = await prisma.refund.update({
            where: { id: req.refund_id },
            data: { status: status }
        });

        if (status === "APPROVED" && refund.order) {
            // baru balikin stok
            for (const item of refund.order.orderItems) {
                await prisma.product.update({
                    where: { id: item.product_id },
                    data: { stock: { increment: item.quantity } }
                });
            }

            await prisma.order.update({
                where: { id: refund.order.id },
                data: { status: "REFUNDED" }
            });

            // kalau memang perlu, hapus orderItems & order
            // await tx.orderItem.deleteMany({ where: { order_id: refund.order.id } });
            // await tx.order.delete({ where: { id: refund.order.id } });
        }

        loggerConfig.info(ctx, `Refund status updated to ${status}`, scp);

        return updatedRefund;
    });
}
}