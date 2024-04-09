import { Router } from "express";
import { registerController ,loginController, logoutController} from "../controllers/auth.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/register", registerController);
router.post("/login",loginController)
router.post("/logout",authenticateToken, logoutController); 
export default router;
