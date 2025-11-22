import React from "react";
import { useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";

export default function App() {
  const { user } = useAuth();
  if (!user) return <LoginPage />;
  return <ChatPage />;
}
