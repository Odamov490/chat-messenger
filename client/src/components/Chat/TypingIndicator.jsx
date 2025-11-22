import React from "react";

export default function TypingIndicator({ typingUsers }) {
  const names = Object.values(typingUsers);
  if (!names.length) return null;
  return (
    <div className="text-xs text-slate-400 mt-1">
      {names.join(", ")} yozmoqda...
    </div>
  );
}
