import { Request, Response, NextFunction } from "express";
import { BinderbyteService } from "./shipping.controller";
import { Wrapper } from "../../utils/wrapper.utils";

export class BinderbyteController {
  static async getCost(req: Request, res: Response, next: NextFunction) {
    try {
      const { origin, destination, courier, weight } = req.query;
      const data = await BinderbyteService.getCost(
        origin as string,
        destination as string,
        courier as string,
        Number(weight)
      );
      Wrapper.success(res, true, data, "Sukses mendapatkan ongkir", 200);
    } catch (err) {
      next(err);
    }
  }

  static async trackResi(req: Request, res: Response, next: NextFunction) {
    try {
      const { courier, awb } = req.query;
      const data = await BinderbyteService.trackResi(
        courier as string,
        awb as string
      );
      Wrapper.success(res, true, data, "Sukses tracking resi", 200);
    } catch (err) {
      next(err);
    }
  }
}
