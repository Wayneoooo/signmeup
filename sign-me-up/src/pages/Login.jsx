import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import  logo  from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Server error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden p-6">
      {/* Background decorative blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 1 }}
        className="absolute top-20 left-8 w-72 h-72 bg-blue-300 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="absolute bottom-8 right-8 w-80 h-80 bg-purple-300 rounded-full blur-3xl"
      />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 w-full max-w-md z-10"
      >
      {/* Logo placeholder */}
              <div className="flex justify-center mb-6">
               <img src={logo} alt className="w-24 h-24 object-contain" />
              </div>
        

        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-1">Welcome back</h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Log in to continue to <span className="text-red-600 font-medium">SignMeUp</span>
        </p>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 font-medium">Password</label>
              <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-1 bg-red-600 text-white rounded-xl shadow hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Signing in..." : "Login"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-red-600 font-medium hover:underline">
            Create one
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

