import Joi from "joi";

export class refundSchema {
    static readonly refundOrder = Joi.object({
        order_id: Joi.string().max(50).required(),
        reason: Joi.string().max(255).required(),
        status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED').required()
    })

    static readonly getRefundId = Joi.object({
        refund_id : Joi.number().required()
    })

    static readonly getRefundOrder = Joi.object({
        refund_id : Joi.number().required(),
        search: Joi.string().allow("", null),
        periode: Joi.number().required(),
        page: Joi.number().required(),
        quantity: Joi.number().required()
    })
}