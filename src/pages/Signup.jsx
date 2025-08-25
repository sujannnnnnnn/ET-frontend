import { useState } from "react";
import { signup } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react"; // modern icons

export default function Signup() {
  const [form, setForm] = useState({ email: "", full_name: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 bottom-10 right-10 animate-pulse"></div>

      {/* Card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-96 border border-white/30"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">Create Account</h2>

        {/* Full Name */}
        <div className="relative mb-4">
          <User className="absolute left-3 top-3 text-white/70" size={20} />
          <input
            type="text"
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3 text-white/70" size={20} />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <Lock className="absolute left-3 top-3 text-white/70" size={20} />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
        >
          Sign Up
        </motion.button>

        {/* Login Redirect */}
        <p className="text-center text-sm text-white/80 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-pink-300 font-semibold cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </motion.form>
    </div>
  );
}
