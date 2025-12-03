import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events"); // "events" or "users"
  const [modal, setModal] = useState({ open: false, type: "", data: null });
  const [message, setMessage] = useState("");

  // Fetch events and users
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [eventsRes, usersRes] = await Promise.all([
          fetch("http://localhost:3000/events", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:3000/auth/users", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const eventsData = await eventsRes.json();
        const usersData = await usersRes.json();

        setEvents(eventsData);
        setUsers(usersData);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchData();
  }, [token]);

  // ----------------------- MODAL HANDLERS -----------------------
  const openModal = (type, data = null) => setModal({ open: true, type, data });
  const closeModal = () => setModal({ open: false, type: "", data: null });

  // ----------------------- EVENT ACTIONS -----------------------
  const handleDeleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`http://localhost:3000/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete event");
      setEvents(prev => prev.filter(e => e.id !== id));
      setMessage("Event deleted successfully!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleEventSubmit = async (eventData) => {
    const method = modal.type === "edit-event" ? "PUT" : "POST";
    const url = modal.type === "edit-event"
      ? `http://localhost:3000/events/${modal.data.id}`
      : "http://localhost:3000/events";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(eventData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save event");

      if (method === "POST") setEvents(prev => [...prev, data]);
      else setEvents(prev => prev.map(e => (e.id === data.event.id ? data.event : e)));

      setMessage("Event saved successfully!");
      closeModal();
    } catch (err) {
      setMessage(err.message);
    }
  };

  // ----------------------- USER ROLE ACTION -----------------------
  const handleRoleUpdate = async (userId, role) => {
    if (userId === user.id) return alert("You cannot change your own role.");
    try {
      const res = await fetch(`http://localhost:3000/auth/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
      setMessage("User role updated successfully!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading admin data...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {message && <p className="mb-4 text-green-600 font-semibold">{message}</p>}

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "events" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("events")}
        >Events</button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("users")}
        >Users</button>
      </div>

      {/* ----------------------- EVENTS TAB ----------------------- */}
      {activeTab === "events" && (
        <>
          <button
            className="mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            onClick={() => openModal("create-event")}
          >+ Create Event</button>

          <div className="flex flex-col gap-4">
            {events.map(event => (
              <div key={event.id} className="flex justify-between items-center border p-4 rounded hover:bg-gray-100">
                <div>
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</p>
                  <p className="text-gray-700">{event.location}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal("edit-event", event)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >Edit</button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >Delete</button>
                  <button
                    onClick={() => openModal("view-signups", event)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >View Signups</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ----------------------- USERS TAB ----------------------- */}
      {activeTab === "users" && (
        <div className="flex flex-col gap-4">
          {users.map(u => (
            <div key={u.id} className="flex justify-between items-center border p-4 rounded hover:bg-gray-100">
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-gray-600">{u.email}</p>
                <p className="text-sm text-gray-600">Role: {u.role}</p>
              </div>
              {u.id !== user.id && (
                <select
                  value={u.role}
                  onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ----------------------- MODAL ----------------------- */}
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

// ----------------------- MODAL COMPONENT -----------------------
function Modal({ type, data, onClose, onSubmit, token }) {
  const [form, setForm] = useState({
    title: data?.title || "",
    description: data?.description || "",
    date: data?.date ? new Date(data.date).toISOString().slice(0,16) : "",
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

  if (type === "view-signups") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20">
        <div className="bg-white p-6 rounded shadow w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">{data.title} - Signups</h2>
          {signups.length === 0 ? <p>No users signed up yet.</p> :
            <ul className="list-disc pl-5">
              {signups.map(s => <li key={s.user.id}>{s.user.name} ({s.user.email})</li>)}
            </ul>
          }
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{type === "edit-event" ? "Edit Event" : "Create Event"}</h2>
        <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
          <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border w-full p-2 mb-2 rounded" required />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border w-full p-2 mb-2 rounded" required />
          <input type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="border w-full p-2 mb-2 rounded" required />
          <input type="text" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="border w-full p-2 mb-4 rounded" required />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
