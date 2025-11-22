import React, { useState } from "react";
import LoginForm from "../components/Auth/LoginForm.jsx";
import RegisterForm from "../components/Auth/RegisterForm.jsx";

export default function LoginPage() {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-xl">
        {mode === "login" ? (
          <LoginForm onSwitch={() => setMode("register")} />
        ) : (
          <RegisterForm onSwitch={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}
