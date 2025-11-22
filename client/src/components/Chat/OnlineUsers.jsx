import React from "react";
import { useSocket } from "../../context/SocketContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function OnlineUsers() {
  const { onlineUsers } = useSocket();
  const { user } = useAuth();

  const list = onlineUsers.filter((u) => u.id !== user?.id);

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 mb-1">Online</h3>
      <div className="space-y-1 text-sm">
        {list.length === 0 && <div className="text-slate-500">Hech kim yo'q</div>}
        {list.map((u) => (
          <div key={u.id} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{u.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
