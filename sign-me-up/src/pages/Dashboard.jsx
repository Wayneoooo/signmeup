import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

export default function Dashboard() {
  const { token } = useAuth();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState("");

  // Fetch user's signed-up events
  const fetchSignups = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/events/my-signups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok || res.status === 200) setEvents(data);
      else console.error(data.error || "Failed to fetch events");
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSignups();
  }, [token]);

  // Refresh if redirected from EventDetails after signup/cancel
  useEffect(() => {
    if (location.state?.refresh) {
      fetchSignups();
      window.history.replaceState({}, document.title); // clear state so it doesn't refresh again
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
      setMessage("Signup canceled successfully");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Could not cancel signup");
    }
    setActionLoading((prev) => ({ ...prev, [eventId]: false }));
  };

  if (loading) return <p className="p-10 text-center">Loading your events...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Signed-Up Events</h1>

      {message && <p className="mb-4 text-green-600 font-semibold">{message}</p>}

      {events.length === 0 ? (
        <p>You haven’t signed up for any events yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex justify-between items-center border p-4 rounded-lg hover:bg-gray-100 transition"
            >
              <Link
                to={`/events/${event.id}`}
                state={{ refresh: true }} // trigger refresh on return
                className="flex-1"
              >
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(event.date).toLocaleString()}
                </p>
                <p className="text-gray-700">{event.location}</p>
              </Link>

              <button
                onClick={() => handleCancel(event.id)}
                disabled={actionLoading[event.id]}
                className="ml-4 px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                {actionLoading[event.id] ? "Cancelling..." : "Cancel"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

