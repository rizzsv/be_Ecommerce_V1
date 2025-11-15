import axios from "axios";
import { binderbyteConfig } from "../../config/shipping.config";
import { ErrorHandler } from "../../config/custom.config";


export class BinderbyteService {
  // Cek ongkir
  static async getCost(origin: string, destination: string, courier: string, weight: number) {
    try {
      const res = await axios.get(`${binderbyteConfig.baseUrl}/cost`, {
        params: {
          api_key: binderbyteConfig.apiKey,
          origin,
          destination,
          weight,
          courier,
        },
      });
      return res.data;
    } catch (error: any) {
      throw new ErrorHandler(500, error.response?.data?.message || "Gagal hit Binderbyte API");
    }
  }

  // Tracking resi
  static async trackResi(courier: string, awb: string) {
    try {
      const res = await axios.get(`${binderbyteConfig.baseUrl}/track`, {
        params: {
          api_key: binderbyteConfig.apiKey,
          courier,
          awb,
        },
      });
      return res.data;
    } catch (error: any) {
      throw new ErrorHandler(500, error.response?.data?.message || "Gagal tracking resi");
    }
  }
}
