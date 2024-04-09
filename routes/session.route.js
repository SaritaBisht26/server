import { Router } from "express";
import { getLogSession } from "../controllers/session.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";
const sessionRouter = Router();
sessionRouter.get(authenticateToken, getLogSession);
export default sessionRouter;
