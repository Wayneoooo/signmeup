import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events");
  const [modal, setModal] = useState({ open: false, type: "", data: null });
  const [message, setMessage] = useState("");

  // Fetch events + users
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [eventsRes, usersRes] = await Promise.all([
          fetch("http://localhost:3000/events", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:3000/auth/users", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setEvents(await eventsRes.json());
        setUsers(await usersRes.json());
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchData();
  }, [token]);

  const openModal = (type, data = null) => setModal({ open: true, type, data });
  const closeModal = () => setModal({ open: false, type: "", data: null });

  // ---------------- EVENTS CRUD ----------------
  const handleDeleteEvent = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:3000/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setEvents(prev => prev.filter(e => e.id !== id));
      setMessage("Event deleted successfully!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleEventSubmit = async (eventData) => {
    const isEdit = modal.type === "edit-event";
    const url = isEdit
      ? `http://localhost:3000/events/${modal.data.id}`
      : "http://localhost:3000/events";

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(eventData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (!isEdit) setEvents(prev => [...prev, data]);
      else setEvents(prev => prev.map(e => (e.id === data.event.id ? data.event : e)));

      setMessage("Event saved successfully!");
      closeModal();
    } catch (err) {
      setMessage(err.message);
    }
  };

  // ---------------- USER ROLES ----------------
  const handleRoleUpdate = async (userId, role) => {
    if (userId === user.id) return alert("You cannot change your own role.");
    try {
      const res = await fetch(`http://localhost:3000/auth/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role } : u)));
      setMessage("User role updated!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading admin data...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>

      {message && (
        <p className="mb-4 text-green-700 bg-green-100 p-2 rounded">{message}</p>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-medium transition ${
            activeTab === "events"
              ? "bg-red-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>

        <button
          className={`px-4 py-2 rounded font-medium transition ${
            activeTab === "users"
              ? "bg-red-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </div>

      {/* EVENTS TAB */}
      {activeTab === "events" && (
        <>
          <button
            className="mb-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
            onClick={() => openModal("create-event")}
          >
            + Create Event
          </button>

          <div className="flex flex-col gap-4">
            {events.map(event => (
              <div
                key={event.id}
                className="flex justify-between items-center border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
                  <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</p>
                  <p className="text-gray-700">{event.location}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal("edit-event", event)}
                    className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => openModal("view-signups", event)}
                    className="px-3 py-1 rounded bg-gray-800 hover:bg-black text-white"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="flex flex-col gap-4">
          {users.map(u => (
            <div
              key={u.id}
              className="flex justify-between items-center border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-gray-900">{u.name}</p>
                <p className="text-gray-600">{u.email}</p>
                <p className="text-sm text-gray-600">Role: {u.role}</p>
              </div>

              {u.id !== user.id && (
                <select
                  value={u.role}
                  onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                  className="border px-2 py-1 rounded bg-gray-50"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <Modal
          type={modal.type}
          data={modal.data}
          onClose={closeModal}
          onSubmit={handleEventSubmit}
          token={token}
        />
      )}
    </div>
  );
}

/* ----------------------- MODAL ----------------------- */

function Modal({ type, data, onClose, onSubmit, token }) {
  const [form, setForm] = useState({
    title: data?.title || "",
    description: data?.description || "",
    date: data?.date ? new Date(data.date).toISOString().slice(0, 16) : "",
    location: data?.location || ""
  });

  const [signups, setSignups] = useState([]);

  useEffect(() => {
    if (type === "view-signups" && data?.id) {
      fetch(`http://localhost:3000/events/${data.id}/signups`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setSignups)
        .catch(console.error);
    }
  }, [type, data, token]);

  // view signups modal
  if (type === "view-signups") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20">
        <div className="bg-white p-6 rounded-lg shadow w-full max-w-xl">
          <h2 className="text-xl font-bold mb-4">{data.title} — Signups</h2>

          {signups.length === 0 ? (
            <p>No users signed up yet.</p>
          ) : (
            <ul className="list-disc pl-5">
              {signups.map(s => (
                <li key={s.user.id}>{s.user.name} ({s.user.email})</li>
              ))}
            </ul>
          )}

          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-700 hover:bg-black text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // create/edit modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">
          {type === "edit-event" ? "Edit Event" : "Create Event"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
        >
          <input
            className="border w-full p-2 rounded mb-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            className="border w-full p-2 rounded mb-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <input
            type="datetime-local"
            className="border w-full p-2 rounded mb-2"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />

          <input
            className="border w-full p-2 rounded mb-4"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

