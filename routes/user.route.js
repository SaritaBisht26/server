import { Router } from "express";
import {
  getUserProfileController,
  updateUserController,
  getAllUsersController,
} from "../controllers/user.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/profile", authenticateToken, getUserProfileController);
router.get("/", authenticateToken, getAllUsersController);
router.put("/", authenticateToken, updateUserController);

export default router;
