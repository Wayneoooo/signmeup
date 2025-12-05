import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) throw new Error("Registration failed");

      navigate("/login");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-red-600 mb-6 text-center">
          Sign Me Up!
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            className="border border-gray-300 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border border-gray-300 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border border-gray-300 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Already registered?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-600 font-medium cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
