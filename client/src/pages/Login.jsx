import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("vendor");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      if (user.role !== role) {
        alert("⚠️ Role mismatch. Please select the correct role.");
        return;
      }

      login(token, user);

      if (user.role === "vendor") navigate("/vendor/home");
      else if (user.role === "supplier") navigate("/supplier/home");
      else if (user.role === "admin") navigate("/admin");

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("❌ Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FFFC] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-[#91EAAF]"
      >
        <h2 className="text-3xl font-extrabold text-center text-[#4D7111] mb-6">
          🚀 Welcome Back!
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-[#91EAAF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-[#91EAAF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="w-full p-3 border border-[#91EAAF] rounded-lg text-[#1F4B2C] bg-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="vendor">Vendor</option>
            <option value="supplier">Supplier</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 bg-[#4D7111] text-white font-semibold rounded-lg hover:bg-[#3d5f0e] transition"
          >
            🔐 Login
          </button>
        </form>

        <div className="text-center text-sm mt-6 text-gray-500">
          New here?{" "}
          <a href="/register" className="text-[#4D7111] hover:underline">
            Create an account
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
