import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import User from "../model/user.model.js";
import { logLoginSession } from "./session.controller.js";
const createOrderController = async (req, res) => {
  try {
    const cart = req.body.cart;
    const userId = req.user;
    const products = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }
        return {
          productId: product._id,
          product,
          quantity: item.quantity,
        };
      })
    );
    const totalPrice = products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const order = new Order({
      user: userId,
      products: products.map((item) => item.productId),
      totalPrice: totalPrice,
    });

    await order.save();
    res
      .status(201)
      .json({ success: true, message: "Order created successfully.", order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    await order.save();
    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { updateOrderStatusController, createOrderController };
