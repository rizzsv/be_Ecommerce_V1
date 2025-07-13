import Joi from "joi";

export class wishlistSchema {
  static readonly CreateWishlist = Joi.object({
    product_id: Joi.string().length(24).required().messages({
      "string.base": "Product ID harus berupa string",
      "string.length": "Product ID harus 24 karakter",
      "any.required": "Product ID wajib diisi",
    }),
  });
  static readonly GetWishlist = Joi.object({
    search: Joi.string().allow("", null),
    periode: Joi.number().integer().required().messages({
      "any.required": "Periode wajib diisi",
    }),
    page: Joi.number().integer().min(1).required(),
    quantity: Joi.number().integer().min(1).max(100).required(),
  });
  static readonly DeleteWishlist = Joi.object({
    id: Joi.string().required().messages({
      "any.required": "ID produk wajib diisi",
    }),
  });
}
