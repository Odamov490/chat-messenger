import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LoginForm({ onSwitch }) {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(username, password);
    if (!res.ok) setError(res.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Login</h2>
      <input
        className="w-full p-2 rounded bg-slate-800 border border-slate-700"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full p-2 rounded bg-slate-800 border border-slate-700"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 rounded py-2 font-medium"
      >
        {loading ? "..." : "Login"}
      </button>
      <p className="text-sm text-slate-400">
        Akkauntingiz yo'qmi?{" "}
        <button type="button" onClick={onSwitch} className="text-blue-400 underline">
          Ro'yxatdan o'tish
        </button>
      </p>
    </form>
  );
}
