import Joi from "joi";

export class rattingSchema {
    static readonly CreateRating = Joi.object({
        product_id: Joi.string().length(24).required(),
        messageRating: Joi.string().valid("EXCELLENT", "VERY_GOOD", "GOOD", "FAIR", "POOR").required(),
        review: Joi.string().allow("", null),
    })

    static readonly UpdateRating = Joi.object({
        messageRating: Joi.string().valid("EXCELLENT", "VERY_GOOD", "GOOD", "FAIR", "POOR"),
        review: Joi.string().allow("", null),
    })

    static readonly GetRatingByProduct = Joi.object({
        product_id: Joi.string().length(24).required(),
    })

    static readonly DeleteRating = Joi.object({
        id: Joi.string().length(24).required(),
    })
}