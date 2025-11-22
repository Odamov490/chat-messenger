import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwt.js";
import { createUser, validateUser, setUserAvatar } from "../state/users.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

function makeToken(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    const user = await createUser({ username, password });
    const token = makeToken(user);
    res.json({
      token,
      user: { id: user.id, username: user.username, avatarUrl: user.avatarUrl }
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await validateUser(username, password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = makeToken(user);
  res.json({
    token,
    user: { id: user.id, username: user.username, avatarUrl: user.avatarUrl }
  });
});

router.get("/me", authMiddleware, (req, res) => {
  const user = req.user;
  res.json({ id: user.id, username: user.username, avatarUrl: user.avatarUrl });
});

router.post("/avatar", authMiddleware, (req, res) => {
  const { avatarDataUrl } = req.body;
  if (!avatarDataUrl) return res.status(400).json({ message: "avatarDataUrl required" });
  const updated = setUserAvatar(req.user.id, avatarDataUrl);
  res.json({ id: updated.id, username: updated.username, avatarUrl: updated.avatarUrl });
});

export default router;
