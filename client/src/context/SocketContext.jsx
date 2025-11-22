import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../utils/constants.js";
import { getToken } from "../utils/storage.js";
import { useAuth } from "./AuthContext.jsx";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }
    const token = getToken();
    const s = io(API_URL, {
      auth: { token }
    });
    setSocket(s);

    s.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      s.disconnect();
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
