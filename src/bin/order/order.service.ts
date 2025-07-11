import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { orderSchema } from "./order.schema";
import loggerConfig from "../../config/logger.config";
import { ErrorHandler } from "../../config/custom.config";
import {
  CreateOrderDTO,
  DeleteOrderDTO,
  GetOrderByIdDTO,
  GetOrderDTO,
  OrderItemInput,
  UpdateOrderStatusDTO,
} from "./order.model";
import { getPaymentAccount } from "../../config/payment.config";

export class OrderService {
  static async createOrder(req: CreateOrderDTO, userId: string) {
    const ctx = "Create Order";
    const scp = "Order";
    const userRequest = Validator.Validate(orderSchema.CreateOrder, req);
    const accountInfo = getPaymentAccount(userRequest.payment_method);

    const isOrderExist = await prisma.order.count({
      where: {
        OR: [{ user_id: userRequest.user_id, status: userRequest.status }],
      },
    });

    if (isOrderExist !== 0) {
      loggerConfig.error(ctx, "Order already regist");
      throw new ErrorHandler(409, "Order sudah terdaftar");
    }

    const product = await prisma.product.findFirst({
      where: { id: userRequest.items[0].product_id },
    });

    if (!product) throw new ErrorHandler(404, "Produk tidak ditemukan");

    const createOrder = await prisma.order.create({
      data: {
        user_id: userId,
        status: userRequest.status,
        total_amount: userRequest.total_amount,
        shipping_address: userRequest.shipping_address,
        payment_method: userRequest.payment_method,
        orderItems: {
          create: userRequest.items.map((item: OrderItemInput) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: product.price,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    loggerConfig.info(ctx, `Order created successfully`, scp);

    return {
      ...createOrder,
      payment_account: accountInfo,
    };
  }

  static async updateOrderStatus(req: UpdateOrderStatusDTO) {
    const ctx = "Update Order Status";
    const scp = "Order";

    const userRequest = Validator.Validate(orderSchema.UpdateOrderStatus, req);

    const isOrderExist = await prisma.order.findFirst({
      where: {
        id: userRequest.order_id,
      },
    });

    if (!isOrderExist) {
      loggerConfig.error(ctx, "Order not found", scp);
      throw new ErrorHandler(404, "Order tidak ditemukan");
    }

    userRequest.order_id ??= isOrderExist.id;
    userRequest.status ??= isOrderExist.status;

    await prisma.order.update({
      where: {
        id: userRequest.order_id,
      },
      data: {
        status: userRequest.status,
      },
    });

    return {};
  }

  static async getOrderById(req: GetOrderByIdDTO) {
    const ctx = "Get Order By ID";
    const scp = "Order";

    const userRequest = Validator.Validate(orderSchema.GetOrderById, req);

    const isOrderExist = await prisma.order.findFirst({
      where: {
        id: userRequest.order_id,
      },
    });

    if (!isOrderExist) {
      loggerConfig.error(ctx, "Order not found", scp);
      throw new ErrorHandler(404, "Order tidak ditemukan");
    }

    const order = await prisma.order.findFirst({
      where: {
        id: userRequest.order_id,
        user_id: userRequest.user_id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      loggerConfig.error(ctx, "Order not found", scp);
      throw new ErrorHandler(404, "Order tidak ditemukan");
    }

    loggerConfig.info(ctx, `Order retrieved successfully`, scp);

    return order;
  }

  static async getAllOrders(req: GetOrderDTO) {
    const ctx = "Get All Orders";
    const scp = "Order";

    const userRequest = Validator.Validate(orderSchema.GetOrder, req);

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
      prisma.order.findMany({
        where: filter,
        orderBy: {
          created_at: "desc",
        },
        skip: (userRequest.page - 1) * userRequest.quantity,
        take: userRequest.quantity,
      }),
      prisma.order.count({
        where: filter,
      }),
    ]);
    if (result.length === 0) {
      loggerConfig.info(ctx, "No Ordeer found", scp);
      throw new ErrorHandler(404, "Tidak ada order ditemukan");
    }

    const metaData = {
      totalItem,
      currentPage: userRequest.page,
      quantity: userRequest.quantity,
      totalPages: Math.ceil(totalItem / userRequest.quantity),
    };

    loggerConfig.info(ctx, 'Success get order data', scp)

    return {
      data: result.map((order) => ({
        id: order.id,
        user_id: order.user_id,
        status: order.status,
        total_amount: order.total_amount,
        shipping_address: order.shipping_address,
        payment_method: order.payment_method,
        created_at: order.created_at,
        updated_at: order.updated_at,
      })),
      metaData,
    }
  }

    static async deleteOrder(req: DeleteOrderDTO) {
    const ctx = "Delete Order";
    const scp = "Order";

    const userRequest = Validator.Validate(orderSchema.DeleteOrder, req);

    const isOrderExist = await prisma.order.findFirst({
      where: {
        id: userRequest.id,
      },
    });

    if (!isOrderExist) {
      loggerConfig.error(ctx, "Order not found", scp);
      throw new ErrorHandler(404, "Order tidak ditemukan");
    }

    await prisma.orderItem.deleteMany({
      where: {
        order_id: userRequest.id,
      },
    })

    await prisma.order.delete({
      where: {
        id: userRequest.id,
      },
    });

    loggerConfig.info(ctx, `Order deleted successfully`, scp);

    return {};
  }
}
