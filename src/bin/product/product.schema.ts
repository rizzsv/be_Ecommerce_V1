import Joi from "joi";

export class productSchema {
  static readonly CreateProduct = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.base": "Nama produk harus berupa teks",
      "string.empty": "Nama produk tidak boleh kosong",
      "string.min": "Nama produk minimal 3 karakter",
      "string.max": "Nama produk maksimal 100 karakter",
      "any.required": "Nama produk wajib diisi",
    }),
    description: Joi.string().min(10).required().messages({
      "string.base": "Deskripsi harus berupa teks",
      "string.empty": "Deskripsi tidak boleh kosong",
      "string.min": "Deskripsi minimal 10 karakter",
      "any.required": "Deskripsi wajib diisi",
    }),
    price: Joi.number().positive().required().messages({
      "number.base": "Harga harus berupa angka",
      "number.positive": "Harga harus lebih dari 0",
      "any.required": "Harga wajib diisi",
    }),
    stock: Joi.number().integer().min(0).required().messages({
      "number.base": "Stok harus berupa angka",
      "number.integer": "Stok harus berupa angka bulat",
      "number.min": "Stok minimal 0",
      "any.required": "Stok wajib diisi",
    }),
    image: Joi.string().required().messages({
      "string.base": "Link gambar harus berupa teks",
      "string.uri": "Format URL gambar tidak valid",
      "any.required": "Gambar wajib diisi",
    }),
    category: Joi.string().required().messages({
      "any.required": "Kategori wajib diisi",
    }),
    variants: Joi.array()
      .items(
        Joi.object({
          size: Joi.string().required(),
          color: Joi.string().required(),
          stock: Joi.number().integer().min(0).required(),
        })
      )
      .optional(),
  });

  static readonly UpdateProduct = Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().min(10),
    price: Joi.number().positive(),
    stock: Joi.number().integer().min(0),
    image: Joi.string().uri(),
    category: Joi.string().length(5),
  })
    .min(1)
    .messages({
      "object.min": "Setidaknya satu field harus diubah",
    });

  static readonly GetByIdProduct = Joi.object({
    id: Joi.string().length(24).required().messages({
      "string.length": "ID produk harus 24 karakter (ObjectId)",
      "any.required": "ID produk wajib diisi",
    }),
  });

  static readonly DeleteProduct = Joi.object({
    id: Joi.string().length(5).required().messages({
      "string.length": "ID produk harus 24 karakter (ObjectId)",
      "any.required": "ID produk wajib diisi",
    }),
  });

  static readonly GetAllProduct = Joi.object({
    search: Joi.string().allow("", null),
    periode: Joi.number().integer().valid(1, 7, 30).required().messages({
      "any.only": "Periode hanya bisa 1, 7, atau 30 hari",
      "any.required": "Periode wajib diisi",
    }),
    page: Joi.number().integer().min(1).required(),
    quantity: Joi.number().integer().min(1).max(100).required(),
  });
}
