import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { listGroups, createGroup } from "../state/groups.js";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.json(listGroups());
});

router.post("/", authMiddleware, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name required" });
  const group = createGroup(name);
  res.json(group);
});

export default router;
