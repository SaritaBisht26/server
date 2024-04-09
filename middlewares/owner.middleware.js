import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const isOwner = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findById(decoded.userId);
        req.user = user;
      } catch (error) {
        req.user = null; // Set req.user to null if token is invalid
      }
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

export default isOwner;
