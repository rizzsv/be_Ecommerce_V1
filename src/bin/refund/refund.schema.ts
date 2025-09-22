import Joi from "joi";

export class refundSchema {
    static readonly refundOrder = Joi.object({
        id: Joi.string().length(24).required(),
        order_number: Joi.string().max(50).required(),
        reason: Joi.string().max(255).required(),
        status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED').required()
    })
}