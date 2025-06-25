import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import EventForm from "./EventForm";
import Calendar from "./Calendar";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [view, setView] = useState("month");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log(token, storedUser);
    

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));

      // ✅ Set default axios Authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 🔍 Debug log
      console.log(
        "Authorization Header Set:",
        axios.defaults.headers.common["Authorization"]
      );
    }
  }, []);

  // Load events once user is set
  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://calendar-backend-six-phi.vercel.app/api/events");
      if (res.data.success) {
        setEvents(res.data.events);
      } else {
        setError(res.data.message || "Failed to fetch events");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (eventData) => {
    setLoading(true);
    try {
      const res = editEvent
        ? await axios.put(
            `https://calendar-backend-six-phi.vercel.app/api/events/${editEvent._id}`,
            eventData
          )
        : await axios.post("https://calendar-backend-six-phi.vercel.app/api/events", eventData);

      if (res.data.success) {
        setEvents((prev) =>
          editEvent
            ? prev.map((ev) => (ev._id === editEvent._id ? res.data.event : ev))
            : [...prev, res.data.event]
        );
        setEditEvent(null);
        setError("");
      } else {
        setError(res.data.message || "Failed to save event");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error saving event");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!id) {
      setError("Invalid event ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this event?")) return;

    setLoading(true);
    try {
      const res = await axios.delete(`https://calendar-backend-six-phi.vercel.app/api/events/${id}`);
      if (res.data.success) {
        setEvents((prev) => prev.filter((ev) => ev._id !== id));
        setError("");
      } else {
        setError(res.data.message || "Failed to delete event");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Error deleting event";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (id) => {
    if (!id) {
      setError("Invalid event ID");
      return;
    }

    setLoading(true);
    try {
      const event = events.find((ev) => ev._id === id);
      if (!event) throw new Error("Event not found");

      const res = await axios.put(`https://calendar-backend-six-phi.vercel.app/api/events/${id}`, {
        completed: !event.completed,
      });

      if (res.data.success) {
        setEvents((prev) =>
          prev.map((ev) =>
            ev._id === id ? { ...ev, completed: !ev.completed } : ev
          )
        );
        setError("");
      } else {
        setError(res.data.message || "Failed to update event");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Error updating event";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setMode("login");
    setEvents([]);
    setEditEvent(null);
  };

  // Render login or signup page
  if (!user) {
    return (
      <>
        {mode === "login" ? (
          <Login setUser={setUser} switchToSignup={() => setMode("signup")} />
        ) : (
          <Signup setUser={setUser} switchToLogin={() => setMode("login")} />
        )}
        {error && (
          <div
            style={{
              color: "red",
              textAlign: "center",
              marginTop: "10px",
              background: "#ffe0e0",
              padding: "10px",
              borderRadius: "6px",
            }}
          >
            {error}
          </div>
        )}
      </>
    );
  }

  // Main App content
  return (
    <div
      className="app"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "20px",
        }}
      >
        <span>
          👋 Welcome, <strong>{user.email}</strong>
        </span>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h1 style={{ textAlign: "center" }}>📅 Calendar App</h1>

      <div
        className="view-toggle"
        style={{
          textAlign: "center",
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        <label style={{ marginRight: "8px" }}>View:</label>
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          style={{ padding: "5px", borderRadius: "4px" }}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>

      {error && (
        <div
          style={{
            color: "red",
            padding: "10px",
            margin: "10px 0",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
      )}

      <EventForm
        onAddEvent={addEvent}
        editEvent={editEvent}
        setError={setError}
        loading={loading}
      />

      <Calendar
        events={events}
        setEditEvent={setEditEvent}
        deleteEvent={deleteEvent}
        markCompleted={markCompleted}
        view={view}
        loading={loading}
      />
    </div>
  );
}

export default App;
