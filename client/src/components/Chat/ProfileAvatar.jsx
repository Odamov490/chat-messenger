import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { uploadAvatar } from "../../api/authApi.js";
import { saveAuth, getToken } from "../../utils/storage.js";

export default function ProfileAvatar() {
  const { user, logout } = useAuth();
  const [uploading, setUploading] = useState(false);

  const onChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploading(true);
        const { data } = await uploadAvatar(reader.result);
        const token = getToken();
        saveAuth(token, data);
        window.location.reload();
      } catch (e) {
        console.error(e);
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <label className="relative cursor-pointer">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover border border-slate-700"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl">
            {user?.username?.[0]?.toUpperCase()}
          </div>
        )}
        <input type="file" className="hidden" onChange={onChange} />
        <span className="absolute -bottom-1 -right-1 text-xs bg-slate-900 rounded-full px-1">
          {uploading ? "..." : "✏️"}
        </span>
      </label>
      <div>
        <div className="text-sm font-semibold">{user?.username}</div>
        <button
          onClick={logout}
          className="text-xs text-slate-400 hover:text-red-400"
        >
          Chiqish
        </button>
      </div>
    </div>
  );
}
