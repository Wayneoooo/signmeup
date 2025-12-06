import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:3000/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-6">
      {/* Page Header */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center text-gray-900 mb-10"
      >
        Upcoming <span className="text-red-600">Events</span>
      </motion.h1>

      {/* Empty State */}
      {events.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 text-lg"
        >
          No events available.
        </motion.p>
      ) : (
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/events/${event.id}`}
                className="block bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-red-400 transition-all"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h2>

                <p className="text-gray-600 text-sm mb-1">
                  📅 {new Date(event.date).toLocaleString()}
                </p>

                <p className="text-gray-700">
                  📍 {event.location}
                </p>

                <p className="text-red-600 font-medium mt-2">
                  View Details →
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Decorative Red Glow Blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-0 left-0 w-60 h-60 bg-red-300 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-0 right-0 w-72 h-72 bg-rose-300 rounded-full blur-3xl"
      />
    </div>
  );
}
