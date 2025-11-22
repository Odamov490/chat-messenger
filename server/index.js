import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import authRouter from "./routes/auth.js";
import groupRouter from "./routes/groups.js";
import { authMiddlewareSocket } from "./middleware/authSocket.js";
import { usersOnline, registerOnlineUser, removeOnlineUser, getOnlineUsers } from "./state/onlineUsers.js";
import { handleVideoSocketEvents } from "./socket/video.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Simple health endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Chat server running" });
});

// REST routes
app.use("/api/auth", authRouter);
app.use("/api/groups", groupRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.use(authMiddlewareSocket);

io.on("connection", (socket) => {
  const user = socket.user;
  registerOnlineUser(user, socket.id);
  io.emit("online_users", getOnlineUsers());

  // Join default room
  socket.join("general");

  socket.on("send_message", (payload) => {
    const msg = {
      id: Date.now().toString(),
      from: { id: user.id, username: user.username, avatarUrl: user.avatarUrl },
      text: payload.text || "",
      type: payload.type || "text",
      fileName: payload.fileName || null,
      fileDataUrl: payload.fileDataUrl || null,
      roomId: payload.roomId || "general",
      createdAt: new Date().toISOString()
    };
    if (msg.roomId) {
      io.to(msg.roomId).emit("receive_message", msg);
    } else if (payload.toUserId) {
      const targetSocketId = usersOnline[payload.toUserId];
      if (targetSocketId) {
        io.to(targetSocketId).emit("receive_message", msg);
      }
      socket.emit("receive_message", msg);
    } else {
      io.emit("receive_message", msg);
    }
  });

  socket.on("typing", ({ roomId, isTyping }) => {
    socket.to(roomId || "general").emit("typing", {
      userId: user.id,
      username: user.username,
      isTyping: !!isTyping
    });
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
  });

  // WebRTC video signaling
  handleVideoSocketEvents(io, socket);

  socket.on("disconnect", () => {
    removeOnlineUser(user.id);
    io.emit("online_users", getOnlineUsers());
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
