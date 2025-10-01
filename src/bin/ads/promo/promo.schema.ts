import joi from "joi";

export class promoSchema {
    static readonly addPromo = joi.object({
        title: joi.string().min(3).max(50).required().messages({
            "string.base": "Title harus berupa string",
            "string.empty": "Title tidak boleh kosong",
        }), discount: joi.number().min(1).max(100).required().messages({
            "number.base": "Discount harus berupa angka",
            "number.min": "Discount minimal 1%",
            "number.max": "Discount maksimal 100%",
            "any.required": "Discount wajib diisi",
        }),
        code: joi.string().min(3).max(50).required().messages({
            "string.base": "Code harus berupa string",
            "string.empty": "Code tidak boleh kosong",
        }),
        description: joi.string().min(5).required().messages({
            "string.base": "Deskripsi harus berupa teks",
            "string.empty": "Deskripsi tidak boleh kosong",
            "string.min": "Deskripsi minimal 5 karakter",
            "any.required": "Deskripsi wajib diisi",
        }),
        expiryDate: joi.date().required().messages({
            "date.base": "Expiry date harus berupa tanggal",
            "any.required": "Expiry date wajib diisi"
        }),
    });
}