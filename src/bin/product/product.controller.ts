import { NextFunction, Response } from "express";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import { createProduct } from "./product.model";
import LoggerService from "../../config/logger.config";
import { logRequest } from "../../helper/logger.request";
import { ProductService } from "./product.service";
import { removeFileIfExists } from "../../helper/delete.file.helper";
import { Wrapper } from "../../utils/wrapper.utils";

export class ProductController {
  static async createProduct(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.files || !(req.files as Express.Multer.File[]).length) {
        throw new ErrorHandler(400, "Produk harus memiliki minimal 1 gambar");
      }

      
      const request: createProduct = {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        image: `product/${(req.files as Express.Multer.File[])[0].filename}`, // thumbnail
        category: req.body.category,
        variants: JSON.parse(req.body.variants),
      };

      await logRequest(req, `POST /product/create` + JSON.stringify(request));

      const imageList = (req.files as Express.Multer.File[]).map(
        (file) => `product/${file.filename}`
      );

      const response = await ProductService.createProduct(
        request,
        req.user!.id,
        imageList
      );
      Wrapper.success(res, true, response, "Sukses membuat produk", 200);
    } catch (e) {
      if (req.files) {
        for (const file of req.files as Express.Multer.File[]) {
          removeFileIfExists(`product/${file.filename}`);
        }
      }
      next(e);
    }
  }
}
