import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/custom.config";
import { createCategory, getCategory, updateCategory } from "./category.model";
import { CategoryService } from "./category.service";
import { Wrapper } from "../../utils/wrapper.utils";
import { logRequest } from "../../helper/logger.request";

export class categoryController {
  static async createCategory(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: createCategory = req.body as createCategory;

      await logRequest(req, `POST /category/create` + JSON.stringify(request));

      const response = await CategoryService.createCategory(request);
      Wrapper.success(res, true, response, "Succes Create Category", 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: updateCategory = req.body as updateCategory;

      await logRequest(req, `PUT /category/update ${JSON.stringify(request)}`);

      const response = await CategoryService.updateCategory(request);
      Wrapper.success(res, true, response, "Succes update category", 200);
    } catch (error) {
      next(error);
    }
  }

  static async getCategory(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: getCategory = req.query as unknown as getCategory;

      request.periode = Number(request.periode);
      request.page = Number(request.page);
      request.quantity = Number(request.quantity);

      await logRequest(req, `GET /category ${JSON.stringify(request)}`);

      const response = await CategoryService.getAllCategory(request);
      Wrapper.pagination(
        res,
        true,
        response.metaData,
        "Succes get category",
        response.data,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request = req.params.id;

      await logRequest(req, `DELETE /category/delete/${request}`);

      const response = await CategoryService.deleteCategory({ id: request });
      Wrapper.success(res, true, response, "Sukses menghapus category", 200);
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryBySlug(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request = req.params.slug;

      await logRequest(req, `GET /category/slug/${request}`);

      const response = await CategoryService.getCategoryBySlug({ slug: request });
      Wrapper.success(res, true, response, "Sukses mendapatkan Slug", 200);
    } catch (error) {
      next(error);
    }
  }
}
