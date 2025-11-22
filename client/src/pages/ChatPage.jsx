import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileAvatar from "../components/Chat/ProfileAvatar.jsx";
import OnlineUsers from "../components/Chat/OnlineUsers.jsx";
import GroupList from "../components/Chat/GroupList.jsx";
import ChatWindow from "../components/Chat/ChatWindow.jsx";
import VideoCallPanel from "../components/Chat/VideoCallPanel.jsx";

export default function ChatPage() {
  const { user } = useAuth();
  const [activeRoomId, setActiveRoomId] = useState("general");

  return (
    <div className="min-h-screen flex items-center justify-center px-2">
      <div className="w-full max-w-6xl h-[80vh] bg-slate-900 border border-slate-700 rounded-xl grid grid-cols-[260px,1fr] gap-0 overflow-hidden shadow-2xl">
        <aside className="border-r border-slate-800 p-4 flex flex-col bg-slate-950">
          <ProfileAvatar />
          <GroupList activeRoomId={activeRoomId} onChangeRoom={setActiveRoomId} />
          <div className="mt-4">
            <OnlineUsers />
          </div>
          <VideoCallPanel />
        </aside>
        <main className="p-4 flex flex-col">
          <div className="border-b border-slate-800 pb-2 mb-2 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Chat Messager</h1>
              <p className="text-xs text-slate-400">Guruh: {activeRoomId}</p>
            </div>
            <div className="text-xs text-slate-500">
              Foydalanuvchi: <span className="font-semibold">{user?.username}</span>
            </div>
          </div>
          <ChatWindow activeRoomId={activeRoomId} />
        </main>
      </div>
    </div>
  );
}
