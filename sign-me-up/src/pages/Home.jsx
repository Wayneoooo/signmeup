import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center"
      >
        {/* Logo placeholder */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-2xl shadow-inner" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-red-600">SignMeUp!</span>
        </h1>

        <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
          A clean and simple platform for managing event sign‑ups with ease. Add
          your own text, images, or branding to make this landing page truly
          yours.
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Link
            to="/events"
            className="px-6 py-3 rounded-xl shadow bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            View Events
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 rounded-xl shadow border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all"
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
