import Joi from "joi";

export class userSchema {
  static readonly login = Joi.object({
    identity: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });

  static readonly createUserByAdmin = Joi.object({
    username: Joi.string()
      .min(5)
      .max(100)
      .pattern(/^[a-z0-9._-]+$/)
      .required()
      .messages({
        "string.empty": "Username tidak boleh kosong",
        "string.min": "Username minimal harus 5 karakter",
        "string.max": "Username terlalu panjang (maksimal 100 karakter)",
        "string.pattern.base":
          "Username hanya boleh huruf kecil, angka, titik, minus, atau underscore",
      }),

    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[A-Z])(?=.*[*\-#]).*$/)
      .required()
      .messages({
        "string.min": "Password minimal 8 karakter",
        "string.pattern.base":
          "Password harus memiliki huruf kapital dan simbol (*, -, atau #)",
      }),

    email: Joi.string().email().required().messages({
      "string.email": "Format email tidak valid",
      "string.empty": "Email tidak boleh kosong",
    }),

    phoneNum: Joi.string()
      .pattern(/^(\+62|62|0)[0-9]{9,14}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must start with 0, 62, or +62 and contain 10-15 digits",
        "string.empty": "Phone number is required",
        "any.required": "Phone number is required",
      }),

    role: Joi.string().valid("ADMIN", "USER").required().messages({
      "any.only": "Role harus ADMIN atau USER",
      "string.empty": "Role tidak boleh kosong",
    }),
  });

  static readonly registerUser = Joi.object({
    username: Joi.string()
      .min(5)
      .max(100)
      .pattern(/^[a-z0-9._-]+$/)
      .required()
      .messages({
        "string.empty": "Username tidak boleh kosong",
        "string.min": "Username minimal harus 5 karakter",
        "string.max": "Username terlalu panjang (maksimal 100 karakter)",
        "string.pattern.base":
          "Username hanya boleh huruf kecil, angka, titik, minus, atau underscore",
      }),

    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[A-Z])(?=.*[*\-#]).*$/)
      .required()
      .messages({
        "string.min": "Password minimal 8 karakter",
        "string.pattern.base":
          "Password harus memiliki huruf kapital dan simbol (*, -, atau #)",
      }),

    email: Joi.string().email().required().messages({
      "string.email": "Format email tidak valid",
      "string.empty": "Email tidak boleh kosong",
    }),

    phoneNum: Joi.string()
      .pattern(/^(\+62|62|0)[0-9]{9,14}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must start with 0, 62, or +62 and contain 10-15 digits",
        "string.empty": "Phone number is required",
        "any.required": "Phone number is required",
      }),
  });

  static readonly updateUser = Joi.object({
    username: Joi.string()
      .min(5)
      .max(100)
      .pattern(/^[a-z0-9._-]+$/)
      .messages({
        "string.min": "Username minimal harus 5 karakter",
        "string.max": "Username terlalu panjang (maksimal 100 karakter)",
        "string.pattern.base":
          "Username hanya boleh huruf kecil, angka, titik, minus, atau underscore",
      }),

    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[A-Z])(?=.*[*\-#]).*$/)
      .messages({
        "string.min": "Password minimal 8 karakter",
        "string.pattern.base":
          "Password harus memiliki huruf kapital dan simbol (*, -, atau #)",
      }),

    email: Joi.string().email().messages({
      "string.email": "Format email tidak valid",
    }),

    role: Joi.string().valid("ADMIN", "USER"),
  });

  static readonly deleteUser = Joi.object({
    id: Joi.string().required().messages({
      "string.empty": "ID user wajib diisi",
    }),
  });

  static readonly Get_User = Joi.object({
    page: Joi.number().integer().positive().min(1).default(1),

    search: Joi.string().optional(),

    quantity: Joi.number().integer().positive().min(5).required(),

    periode: Joi.number()
      .integer()
      .min(2025)
      .max(new Date().getFullYear())
      .optional()
      .messages({
        "any.required": "Tahun wajib diisi",
        "number.base": "Tahun harus berupa angka",
        "number.min": "Tahun tidak boleh kurang dari 2025",
        "number.max": "Tahun belum terjadi",
      }),

    role: Joi.string().valid("ADMIN", "USER").optional(),
  });

  static readonly Get_User_By_Id = Joi.object({
    id: Joi.string().required(),
  });

  static readonly Delete_User = Joi.object({
    id: Joi.string().required(),
  });

  static readonly Request_Otp = Joi.object({
    email: Joi.string().email(),
    username: Joi.string()
      .min(5)
      .max(100)
      .pattern(/^[a-z0-9._-]+$/)
      .messages({
        "string.min": "Username minimal harus 5 karakter",
        "string.max": "Username terlalu panjang (maksimal 100 karakter)",
        "string.pattern.base":
          "Username hanya boleh huruf kecil, angka, titik, minus, atau underscore",
      }),

    phoneNum: Joi.string()
      .pattern(/^(\+62|62|0)[0-9]{9,14}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must start with 0, 62, or +62 and contain 10-15 digits",
        "string.empty": "Phone number is required",
        "any.required": "Phone number is required",
      }),
  });

  static readonly Confirm_Otp = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  });
}
