import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import { findUserById } from "../state/users.js";

export function authMiddlewareSocket(socket, next) {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("No token"));
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.id);
    if (!user) return next(new Error("User not found"));
    socket.user = { id: user.id, username: user.username, avatarUrl: user.avatarUrl };
    next();
  } catch (e) {
    next(new Error("Invalid token"));
  }
}
