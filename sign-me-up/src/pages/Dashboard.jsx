import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { token } = useAuth();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState("");

  const fetchSignups = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/events/my-signups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setEvents(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSignups();
  }, [token]);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchSignups();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleCancel = async (eventId) => {
    setActionLoading((prev) => ({ ...prev, [eventId]: true }));
    setMessage("");

    try {
      const res = await fetch(`http://localhost:3000/events/${eventId}/signup`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not cancel signup");

      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setMessage("Signup canceled successfully.");
    } catch (err) {
      setMessage(err.message || "Error canceling signup.");
    }

    setActionLoading((prev) => ({ ...prev, [eventId]: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading your events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 relative">
      {/* Decorative blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 0.8 }}
        className="absolute top-10 left-10 w-48 h-48 bg-red-300 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute bottom-10 right-12 w-56 h-56 bg-rose-300 rounded-full blur-3xl"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold mb-6 text-gray-900"
        >
          My Signed-Up Events
        </motion.h1>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mb-6 rounded-lg bg-green-50 border border-green-200 text-green-700"
          >
            {message}
          </motion.div>
        )}

        {events.length === 0 ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-700"
          >
            You haven’t signed up for any events yet.
          </motion.p>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex justify-between items-center bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
              >
                <Link
                  to={`/events/${event.id}`}
                  state={{ refresh: true }}
                  className="flex-1"
                >
                  <h2 className="text-xl font-semibold text-gray-900">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleString()}
                  </p>
                  <p className="text-gray-700">{event.location}</p>
                </Link>

                <button
                  onClick={() => handleCancel(event.id)}
                  disabled={actionLoading[event.id]}
                  className="ml-4 px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow disabled:opacity-60"
                >
                  {actionLoading[event.id] ? "Cancelling..." : "Cancel"}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


