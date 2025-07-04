import Joi from "joi";

export class orderSchema {
  static readonly CreateOrder = Joi.object({
    status: Joi.string()
      .valid("PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED")
      .required()
      .messages({
        "any.only": "Status tidak valid",
        "any.required": "Status wajib diisi",
      }),

    total_amount: Joi.number().positive().required().messages({
      "number.base": "Total harus berupa angka",
      "number.positive": "Total harus lebih dari 0",
      "any.required": "Total wajib diisi",
    }),

    shipping_address: Joi.string().min(5).required().messages({
      "string.base": "Alamat harus berupa teks",
      "string.empty": "Alamat tidak boleh kosong",
      "string.min": "Alamat minimal 5 karakter",
      "any.required": "Alamat wajib diisi",
    }),

    payment_method: Joi.string()
      .valid("BCA", "MANDIRI", "BRI")
      .required()
      .messages({
        "any.only": "Metode pembayaran tidak valid",
        "any.required": "Metode pembayaran wajib diisi",
      }),

    items: Joi.array()
      .items(
        Joi.object({
          product_id: Joi.string().length(24).required().messages({
            "string.length": "ID produk harus 24 karakter",
            "any.required": "ID produk wajib diisi",
          }),
          quantity: Joi.number().integer().min(1).required().messages({
            "number.base": "Jumlah harus berupa angka",
            "number.integer": "Jumlah harus bilangan bulat",
            "number.min": "Minimal 1 item",
            "any.required": "Jumlah produk wajib diisi",
          }),
        })
      )
      .min(1)
      .required()
      .messages({
        "array.base": "Items harus berupa array",
        "array.min": "Minimal harus ada 1 item",
        "any.required": "Daftar item wajib diisi",
      }),
  });

  static readonly UpdateOrderStatus = Joi.object({
    order_id: Joi.string().length(24).required().messages({
      "string.length": "ID order harus 24 karakter",
      "any.required": "ID order wajib diisi",
    }),
    status: Joi.string()
      .valid("PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED")
      .required()
      .messages({
        "any.only": "Status tidak valid",
        "any.required": "Status wajib diisi",
      }),
  });

  static readonly GetOrder = Joi.object({
    search: Joi.string().allow("", null),
    periode: Joi.number().integer().required().messages({
      "any.required": "Periode wajib diisi",
    }),
    page: Joi.number().integer().min(1).required(),
    quantity: Joi.number().integer().min(1).max(100).required(),
  });

  static readonly GetOrderById = Joi.object({
    id: Joi.string().required().messages({
      "string.length": "ID produk harus 24 karakter (ObjectId)",
      "any.required": "ID produk wajib diisi",
    }),
    user_id: Joi.string().optional(),
  });

  static readonly DeleteOrder = Joi.object({
    id: Joi.string().required().messages({
      "any.required": "ID produk wajib diisi",
    }),
  });
}
