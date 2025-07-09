import Joi from "joi";

export class cartSchema {
  static readonly CreateCart = Joi.object({
    user_id: Joi.string().length(24).required(),
    product: Joi.array()
      .items(
        Joi.object({
          product_id: Joi.string().length(24).required(),
          quantity: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
  });

  static readonly UpdateCart = Joi.object({
    user_id: Joi.string().length(24).required(),
    product: Joi.array()
      .items(
        Joi.object({
          product_id: Joi.string().length(24).required(),
          quantity: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
  });

  static readonly GetAllCartQuery = Joi.object({
    search: Joi.string().allow("", null),
    periode: Joi.number().integer().required().messages({
      "any.required": "Periode wajib diisi",
    }),
    page: Joi.number().integer().min(1).required(),
    quantity: Joi.number().integer().min(1).max(100).required(),
  });

  static readonly DeleteCart = Joi.object({
    id: Joi.string().length(24).required(),
  });
}
