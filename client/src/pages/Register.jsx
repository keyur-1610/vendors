import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { motion } from "framer-motion";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("vendor");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      alert("✅ Registration successful!");
      navigate("/");
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data || err.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FFFC] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-[#91EAAF] shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center text-[#4D7111] mb-6">
          ✨ Create Your Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border border-[#91EAAF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            className="w-full p-3 border border-[#91EAAF] rounded-lg bg-white text-[#1F4B2C]"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="vendor">Vendor</option>
            <option value="supplier">Supplier</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 bg-[#4D7111] text-white font-semibold rounded-lg hover:bg-[#3B5D0C] transition duration-200"
          >
            📝 Register
          </button>
        </form>

        <div className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <a href="/" className="text-[#4D7111] hover:underline font-medium">
            Login here
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
