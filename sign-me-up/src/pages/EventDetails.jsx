import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function EventDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(""); // success/error messages

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/events/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("Fetch event error:", err);
      }
      setLoading(false);
    }
    fetchEvent();
  }, [id, token]);

  const handleSignup = async () => {
    setActionLoading(true);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:3000/events/${id}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      setEvent((prev) => ({ ...prev, userSignedUp: true }));
      setMessage("Successfully signed up! An email confirmation was sent.");
      // optional: go back to dashboard and refresh
      navigate("/dashboard", { state: { refresh: true } });
    } catch (err) {
      setMessage(err.message || "Signup failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:3000/events/${id}/signup`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cancel failed");

      setEvent((prev) => ({ ...prev, userSignedUp: false }));
      setMessage("Signup canceled. An email was sent to confirm.");
      navigate("/dashboard", { state: { refresh: true } });
    } catch (err) {
      setMessage(err.message || "Cancel failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading event...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Event not found.</p>
          <Link to="/events" className="mt-4 inline-block text-red-600 hover:underline">
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      {/* Red decorative blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 0.7 }}
        className="absolute left-6 bottom-6 w-56 h-56 bg-red-300 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="absolute right-6 bottom-8 w-72 h-72 bg-rose-300 rounded-full blur-3xl"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(event.date).toLocaleString()} • {event.location}
              </p>
            </div>

            <div className="text-right">
              <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>

              {/* Message */}
              {message && (
                <div className="mt-6">
                  <div className="p-3 rounded-md bg-rose-50 border border-rose-100 text-rose-700">
                    {message}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex items-center gap-3">
                {event.userSignedUp ? (
                  <button
                    onClick={handleCancel}
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-xl bg-white border border-red-500 text-red-600 hover:bg-red-50 shadow-sm disabled:opacity-60"
                  >
                    {actionLoading ? "Processing..." : "Cancel Signup"}
                  </button>
                ) : (
                  <button
                    onClick={handleSignup}
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow"
                  >
                    {actionLoading ? "Processing..." : "Sign Up"}
                  </button>
                )}

                <button
                  onClick={() => navigate("/events")}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Back to Events
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="text-sm text-gray-600 mb-4">
                <div><strong>Location</strong></div>
                <div className="mt-1 text-gray-800">{event.location}</div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <div><strong>Date & Time</strong></div>
                <div className="mt-1 text-gray-800">{new Date(event.date).toLocaleString()}</div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <div><strong>Signed up?</strong></div>
                <div className={`mt-1 font-semibold ${event.userSignedUp ? "text-green-600" : "text-gray-700"}`}>
                  {event.userSignedUp ? "Yes — you're signed up" : "No"}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <div><strong>Created</strong></div>
                <div className="mt-1 text-gray-800">{event.createdAt ? new Date(event.createdAt).toLocaleDateString() : "-"}</div>
              </div>
            </aside>
          </div>
        </motion.div>
      </div>
    </div>
  );
}




