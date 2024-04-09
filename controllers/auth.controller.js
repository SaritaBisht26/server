import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import SessionLog from "../model/sessionLogSchema.js";
import { logLoginSession } from "./session.controller.js";

const registerController = async (req, res) => {
  try {
    console.log(req.body)
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    await logLoginSession(user._id, req.ip, req.headers["user-agent"]);
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutController = async (req, res) => {
  try {
    const sessionLog = await SessionLog.findOneAndUpdate(
      { userId: req.user._id, logoutTime: null },
      { logoutTime: new Date() }
    );

    if (!sessionLog) {
      return res.status(404).json({ message: "No active session found" });
    }
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { registerController, loginController, logoutController };
