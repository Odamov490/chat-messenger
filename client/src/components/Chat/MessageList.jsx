import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function MessageList({ messages }) {
  const { user } = useAuth();
  return (
    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
      {messages.map((msg) => {
        const isMe = msg.from?.id === user?.id;
        return (
          <div
            key={msg.id}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs rounded px-3 py-2 text-sm shadow
              ${isMe ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-50"}`}
            >
              {msg.type === "file" && msg.fileDataUrl ? (
                <div className="space-y-1">
                  {msg.fileDataUrl.startsWith("data:image") && (
                    <img
                      src={msg.fileDataUrl}
                      alt={msg.fileName}
                      className="max-h-48 rounded mb-1"
                    />
                  )}
                  <div className="text-xs opacity-80">{msg.fileName}</div>
                </div>
              ) : (
                <p>{msg.text}</p>
              )}
              <div className="text-[10px] opacity-60 mt-1 text-right">
                {msg.from?.username} ·{" "}
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
