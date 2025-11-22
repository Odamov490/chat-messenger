import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext.jsx";

export function useChat(activeRoomId = "general") {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      if (msg.roomId === activeRoomId || !msg.roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTyping = ({ userId, username, isTyping }) => {
      setTypingUsers((prev) => {
        const copy = { ...prev };
        if (isTyping) copy[userId] = username;
        else delete copy[userId];
        return copy;
      });
    };

    socket.on("receive_message", handleMessage);
    socket.on("typing", handleTyping);

    socket.emit("join_room", activeRoomId);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("typing", handleTyping);
      socket.emit("leave_room", activeRoomId);
    };
  }, [socket, activeRoomId]);

  const sendMessage = (payload) => {
    if (!socket) return;
    socket.emit("send_message", { ...payload, roomId: activeRoomId });
  };

  const sendTyping = (isTyping) => {
    if (!socket) return;
    socket.emit("typing", { roomId: activeRoomId, isTyping });
  };

  return { messages, sendMessage, typingUsers, sendTyping };
}
