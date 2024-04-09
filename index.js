import express from "express";
const app = express();
import dotenv from "dotenv";
import connectToDB from "./config/db_connection.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import sessionRouter from "./routes/session.route.js";
import orderRouter from "./routes/order.route.js";
import userRouter from "./routes/user.route.js";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
dotenv.config();
app.use(bodyParser.json());
connectToDB();
const PORT = process.env.PORT || 8080;
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/session-logs", sessionRouter);
app.use("/api/order", orderRouter);
app.listen(PORT, () => {
  console.log("server is listening on port", PORT);
});
