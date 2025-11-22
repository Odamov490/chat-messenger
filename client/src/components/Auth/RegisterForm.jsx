import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function RegisterForm({ onSwitch }) {
  const { register, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await register(username, password);
    if (!res.ok) setError(res.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Ro'yxatdan o'tish</h2>
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
        className="w-full bg-emerald-500 hover:bg-emerald-600 rounded py-2 font-medium"
      >
        {loading ? "..." : "Register"}
      </button>
      <p className="text-sm text-slate-400">
        Akkauntingiz bormi?{" "}
        <button type="button" onClick={onSwitch} className="text-blue-400 underline">
          Login
        </button>
      </p>
    </form>
  );
}
