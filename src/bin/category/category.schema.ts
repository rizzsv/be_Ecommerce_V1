import Joi from "joi";

export class categorySchema {
  static readonly CreateCategory = Joi.object({
    name: Joi.string().min(3).required(),
    slug: Joi.string().min(3).required(),
  });

  static readonly UpdateCategory = Joi.object({
    id: Joi.string().length(24).required(),
    name: Joi.string().min(3),
    slug: Joi.string().min(3),
  });

  static readonly DeleteCategory = Joi.object({
    id: Joi.string().length(24).required(),
  });

  static readonly GetAllCategoryQuery = Joi.object({
    search: Joi.string().allow("", null),
    periode: Joi.number().integer().required().messages({
      "any.required": "Periode wajib diisi",
    }),
    page: Joi.number().integer().min(1).required(),
    quantity: Joi.number().integer().min(1).max(100).required(),
  });

  static readonly GetCategoryById = Joi.object({
    id: Joi.string().length(24).required(),
  });

  static readonly GetCategoryBySlug = Joi.object({
    slug: Joi.string().required(),
  });
}
