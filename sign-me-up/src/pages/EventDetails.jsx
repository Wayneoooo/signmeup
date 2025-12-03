import { useEffect, useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EventDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
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
      setMessage("Successfully signed up!");

      // Navigate back to dashboard and trigger refresh
      navigate("/dashboard", { state: { refresh: true } });
    } catch (err) {
      setMessage(err.message);
    }
    setActionLoading(false);
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
      setMessage("Signup canceled!");

      // Navigate back to dashboard and trigger refresh
      navigate("/dashboard", { state: { refresh: true } });
    } catch (err) {
      setMessage(err.message);
    }
    setActionLoading(false);
  };

  if (loading) return <p className="p-10 text-center">Loading event...</p>;
  if (!event) return <p>Event not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-700 mb-2">{event.description}</p>
      <p className="text-sm text-gray-600 mb-2">
        {new Date(event.date).toLocaleString()}
      </p>
      <p className="text-gray-700 mb-4">{event.location}</p>

      {message && <p className="mb-4 text-green-600 font-semibold">{message}</p>}

      {event.userSignedUp ? (
        <button
          onClick={handleCancel}
          disabled={actionLoading}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          {actionLoading ? "Processing..." : "Cancel Signup"}
        </button>
      ) : (
        <button
          onClick={handleSignup}
          disabled={actionLoading}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          {actionLoading ? "Processing..." : "Sign Up"}
        </button>
      )}
    </div>
  );
}


