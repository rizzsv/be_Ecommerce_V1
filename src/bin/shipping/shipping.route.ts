import { Router } from "express";
import { BinderbyteController } from "./shipping.service";


const router = Router();

router.get("/ongkir", BinderbyteController.getCost);   // contoh: /ongkir?origin=501&destination=114&courier=jne&weight=1000
router.get("/tracking", BinderbyteController.trackResi); // contoh: /tracking?courier=jne&awb=1234567890

export default router;
