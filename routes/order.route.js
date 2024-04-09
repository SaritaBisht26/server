import { Router } from "express";
import {
  createOrderController,
  updateOrderStatusController,
} from "../controllers/order.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/",authenticateToken ,createOrderController);
router.post("/:orderId", updateOrderStatusController);
export default router;
