import Joi from 'joi';

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
        'string.empty': 'Username tidak boleh kosong',
        'string.min': 'Username minimal harus 5 karakter',
        'string.max': 'Username terlalu panjang (maksimal 100 karakter)',
        'string.pattern.base':
          'Username hanya boleh huruf kecil, angka, titik, minus, atau underscore',
      }),

    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[A-Z])(?=.*[*\-#]).*$/)
      .required()
      .messages({
        'string.min': 'Password minimal 8 karakter',
        'string.pattern.base':
          'Password harus memiliki huruf kapital dan simbol (*, -, atau #)',
      }),

    email: Joi.string().email().required().messages({
      'string.email': 'Format email tidak valid',
      'string.empty': 'Email tidak boleh kosong',
    }),

    role: Joi.string().valid('ADMIN', 'USER').required().messages({
      'any.only': 'Role harus ADMIN atau USER',
      'string.empty': 'Role tidak boleh kosong',
    }),
  });

  static readonly registerUser = Joi.object({
    username: Joi.string()
      .min(5)
      .max(100)
      .pattern(/^[a-z0-9._-]+$/)
      .required()
      .messages({
        'string.empty': 'Username tidak boleh kosong',
        'string.min': 'Username minimal harus 5 karakter',
        'string.max': 'Username terlalu panjang (maksimal 100 karakter)',
        'string.pattern.base':
          'Username hanya boleh huruf kecil, angka, titik, minus, atau underscore',
      }),

    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[A-Z])(?=.*[*\-#]).*$/)
      .required()
      .messages({
        'string.min': 'Password minimal 8 karakter',
        'string.pattern.base':
          'Password harus memiliki huruf kapital dan simbol (*, -, atau #)',
      }),

    email: Joi.string().email().required().messages({
      'string.email': 'Format email tidak valid',
      'string.empty': 'Email tidak boleh kosong',
    }),
  });

  static readonly updateUser = Joi.object({
    username: Joi.string()
      .min(5)
      .max(100)
      .pattern(/^[a-z0-9._-]+$/)
      .messages({
        'string.min': 'Username minimal harus 5 karakter',
        'string.max': 'Username terlalu panjang (maksimal 100 karakter)',
        'string.pattern.base':
          'Username hanya boleh huruf kecil, angka, titik, minus, atau underscore',
      }),

    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[A-Z])(?=.*[*\-#]).*$/)
      .messages({
        'string.min': 'Password minimal 8 karakter',
        'string.pattern.base':
          'Password harus memiliki huruf kapital dan simbol (*, -, atau #)',
      }),

    email: Joi.string().email().messages({
      'string.email': 'Format email tidak valid',
    }),

    role: Joi.string().valid('ADMIN', 'USER'),
  });

  static readonly deleteUser = Joi.object({
    id: Joi.string().required().messages({
      'string.empty': 'ID user wajib diisi',
    }),
  });
}
