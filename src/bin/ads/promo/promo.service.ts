import { ErrorHandler } from "../../../config/custom.config";
import prisma from "../../../config/prisma.config";
import { Validator } from "../../../utils/validator.utils";
import { sendPromoEmail } from "../../../helper/nodemailer/email(promo).service";
import { addPromo } from "./promo.model";
import { promoSchema } from "./promo.schema";

export class PromoService {
    static async addPromo(req: addPromo) {
        const ctx = "Add Promo";
        const scp = "Promo";
        const userRequest = Validator.Validate(promoSchema.addPromo, req);

        const isPromoExist = await prisma.promo.findFirst({
            where: {
                title: userRequest.title,
                code: userRequest.code
            }
        })
        if (isPromoExist) {
            throw new ErrorHandler(400, "Promo dengan code tersebut sudah ada");
        }

        const promo = await prisma.promo.create({
            data: {
                title: userRequest.title,
                discount: userRequest.discount,
                code: userRequest.code,
                description: userRequest.description,
                startDate: new Date(),
                endDate: new Date()
            }
        });

        await sendPromoEmail(promo);

        return promo;
    }
}