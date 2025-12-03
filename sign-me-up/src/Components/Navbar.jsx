import { Link } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-300 p-4 flex gap-6 text-gray-900 shadow-sm">
      <Link className="hover:text-blue-600" to="/">Home</Link>

      {!user && (
        <>
          <Link className="hover:text-blue-600" to="/login">Login</Link>
          <Link className="hover:text-blue-600" to="/register">Register</Link>
        </>
      )}

      {user && (
        <>
          <Link className="hover:text-blue-600" to="/events">Events</Link>
          <Link className="hover:text-blue-600" to="/dashboard">Dashboard</Link>

          {/* Only show admin link if user is ADMIN */}
          {user.role === "admin" && (
            <Link className="hover:text-blue-600" to="/admin">Admin</Link>
          )}

          <button
            onClick={logout}
            className="hover:text-red-600 ml-auto"
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}









