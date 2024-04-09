import { Router } from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import {
  addProductController,
  getAllProductController,
  getOneProductController,
  updateProductController,
  deleteProductController,
  getOwnerProductController,
  addOrUpdateProductController,
} from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";
import isOwner from "../middlewares/owner.middleware.js";
const router = Router();
router.get("/my-products", authenticateToken, getOwnerProductController);
router.post(
  "/",
  authenticateToken,
  upload.array("images"), //upload.single("image")
  addProductController
);
router.get("/", isOwner, getAllProductController);
// Get a product by ID
router.get("/:id", getOneProductController);
// Update a product by ID
router.put(
  "/:id",
  authenticateToken,
  upload.array("images"),
  updateProductController
);
router.post(
  "/:id?",
  authenticateToken,
  upload.array("images"),
  addOrUpdateProductController
);

router.delete("/:id", authenticateToken, deleteProductController);

export default router;
