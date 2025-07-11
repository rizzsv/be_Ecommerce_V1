import { NextFunction, Response } from "express";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import { createProduct, getProduct, updateProduct } from "./product.model";
import LoggerService from "../../config/logger.config";
import { logRequest } from "../../helper/logger.request";
import { ProductService } from "./product.service";
import { removeFileIfExists } from "../../helper/delete.file.helper";
import { Wrapper } from "../../utils/wrapper.utils";
import { profile } from "winston";

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
        image: (req.files as Express.Multer.File[])[0].filename, // thumbnail
        category: req.body.category,
        variants: JSON.parse(req.body.variants),
      };

      await logRequest(req, `POST /product/create` + JSON.stringify(request));

      const imageList = (req.files as Express.Multer.File[]).map(
        (file) => file.filename
      );

      const response = await ProductService.createProduct(request, imageList);
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

  static async updateProduct(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: updateProduct = req.body as updateProduct;

      await logRequest(req, `PUT /product/update ${JSON.stringify(request)}`);

      const response = await ProductService.updateProduct(request);
      Wrapper.success(res, true, response, "Succes update product", 200);
    } catch (error) {
      if (req.body.originalname)
        removeFileIfExists(`product/${req.body.originalname}`);
      next(error);
    }
  }

  static async getAllProduct(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: getProduct = req.query as unknown as getProduct;

      request.periode = Number(request.periode);
      request.page = Number(request.page);
      request.quantity = Number(request.quantity);

      await logRequest(req, `GET /product/` + JSON.stringify(request));

      const response = await ProductService.getProductAll(request);
      Wrapper.pagination(
        res,
        true,
        response.metaData,
        "Succes Get Product",
        response.data,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request = req.params.id;

      await logRequest(req, `GET /product/${request}`);

      const response = await ProductService.getProductById({ id: request });
      Wrapper.success(res, true, response, "Sukses mendapatkan produk", 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request = req.params.id;

      await logRequest(req, `DELETE /product/delete/${request}`);

      const response = await ProductService.deleteProduct({ id: request });
      Wrapper.success(res, true, response, "Sukses menghapus produk", 200);
    } catch (error) {
      next(error);
    }
  }
}
