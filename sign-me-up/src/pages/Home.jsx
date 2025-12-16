import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Home() {
  const location = useLocation();
  const logoutMessage = location.state?.logoutMessage;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      
      {logoutMessage && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm shadow-sm">
          {logoutMessage}
        </div>
      )}

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="" className="w-24 h-24 object-contain" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-red-600">SignMeUp!</span>
        </h1>

        <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
          Better Planning, Happy Serving!
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Link
            to="/events"
            className="px-6 py-3 rounded-xl shadow bg-red-600 text-white hover:bg-red-700 transition-all"
          >
            View Events
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 rounded-xl shadow border border-red-600 text-red-600 hover:bg-red-50 transition-all"
          >
            Create Account
          </Link>
        </div>
      </motion.div>

      {/* Decorative bottom blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="absolute bottom-0 right-0 w-56 h-56 bg-purple-300 rounded-full blur-3xl"
      />
    </div>
  );
}



