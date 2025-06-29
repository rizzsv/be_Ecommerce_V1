import Joi from "joi";

export class categorySchema {
    static readonly CreateCategory = Joi.object({
        name: Joi.string().min(3).required(),
        slug: Joi.string().min(3).required()
    })
}