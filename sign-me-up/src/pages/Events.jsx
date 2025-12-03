import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    return <p className="text-center p-10">Loading events...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="block border p-4 rounded-lg hover:bg-gray-100 transition"
            >
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleString()}
              </p>
              <p className="text-gray-700">{event.location}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
