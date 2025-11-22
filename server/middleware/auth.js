import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import { findUserById } from "../state/users.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
