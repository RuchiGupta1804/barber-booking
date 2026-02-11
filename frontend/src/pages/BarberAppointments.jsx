import React, { useEffect, useState } from "react";
import {
  getBarberAppointments,
  markAppointmentCompleted,
} from "../services/api";

const BarberAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState("today");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await getBarberAppointments();
      setAppointments(Array.isArray(res?.appointments) ? res.appointments : []);
    } catch (err) {
      console.error("Load appointments error:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isUpcoming = (date) => new Date(date) > new Date();
  const isHistory = (date) => new Date(date) < new Date();
  const hasEnded = (endTime) => new Date(endTime) <= new Date();

  // ---------- FILTER ----------
  const filtered = appointments
    .filter((a) => {
      if (tab === "today") return isToday(a.startTime) && a.status !== "cancelled";
      if (tab === "upcoming") return isUpcoming(a.startTime) && a.status === "booked";
      if (tab === "history") return isHistory(a.startTime) || a.status === "completed";
      return true;
    })
    .filter((a) =>
      `${a.name || ""} ${a.phone || ""}`.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const todayAppointments = appointments.filter(
    (a) => isToday(a.startTime) && a.status !== "cancelled"
  );
  const completedToday = todayAppointments.filter((a) => a.status === "completed");
  const todayEarnings = completedToday.reduce(
    (sum, a) =>
      sum + (a.services || []).reduce((s, x) => s + (x.price || 0), 0),
    0
  );
  const upcomingCount = appointments.filter(
    (a) => isUpcoming(a.startTime) && a.status === "booked"
  ).length;

  const completeAppointment = async (id) => {
    if (!window.confirm("Mark this appointment as completed?")) return;
    try {
      await markAppointmentCompleted(id);
      loadAppointments();
    } catch (err) {
      console.error("Complete failed:", err);
    }
  };

  return (
    <>
     <style>{`
  .appointments-page {
    padding: 20px;
    background: #f6f7fb;
    min-height: 100vh;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .page-title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 14px;
    color: #222;
  }

  /* ---------- SUMMARY BAR ---------- */
  .summary-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
    background: white;
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.05);
    margin-bottom: 14px;
    font-size: 13px;
    color: #333;
    font-weight: 500;
  }

  .summary-bar div {
    background: #f4f6ff;
    padding: 8px 10px;
    border-radius: 8px;
    text-align: center;
  }

  /* ---------- SEARCH CONTROLS ---------- */
  .controls {
    margin-bottom: 12px;
  }

  .controls input {
    width: 100%;
    max-width: 420px;
    padding: 9px 12px;
    border-radius: 10px;
    border: 1px solid #ddd;
    font-size: 13px;
    outline: none;
    transition: border 0.15s ease, box-shadow 0.15s ease;
  }

  .controls input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  /* ---------- TABS ---------- */
  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }

  .tabs button {
    padding: 7px 14px;
    border-radius: 20px;
    border: 1px solid #ddd;
    background: white;
    color: #444;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .tabs button:hover {
    background: #f0f2f7;
  }

  .tabs button.active {
    background: #4f46e5;
    color: white;
    border-color: #4f46e5;
  }

  /* ---------- APPOINTMENTS LIST ---------- */
  .appointments-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .appointments-list > p {
    background: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    color: #777;
    font-size: 13px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  }

  /* ---------- APPOINTMENT CARD ---------- */
  .appointment-card {
    background: white;
    border-radius: 14px;
    padding: 14px 16px;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.05);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .appointment-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }

  .appointment-card p {
    margin: 4px 0;
    font-size: 13px;
    color: #444;
    line-height: 1.4;
  }

  .appointment-card strong {
    color: #222;
    font-weight: 600;
  }

  /* ---------- STATUS ---------- */
  .status {
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 500;
    text-transform: capitalize;
    display: inline-block;
  }

  .status.booked {
    background: #e0e7ff;
    color: #4338ca;
  }

  .status.completed {
    background: #dcfce7;
    color: #15803d;
  }

  .status.cancelled {
    background: #fee2e2;
    color: #b91c1c;
  }

  /* ---------- ACTION BUTTONS ---------- */
  .card-actions {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .complete-btn {
    padding: 6px 12px;
    border-radius: 8px;
    border: none;
    background: #22c55e;
    color: white;
    font-size: 11px;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.15s ease;
  }

  .complete-btn:hover:not(:disabled) {
    background: #16a34a;
    transform: scale(1.03);
  }

  .complete-btn:disabled {
    background: #bbf7d0;
    color: #065f46;
    cursor: not-allowed;
  }

  /* ---------- MOBILE RESPONSIVE ---------- */
  @media (max-width: 640px) {
    .appointment-card {
      grid-template-columns: 1fr;
    }

    .card-actions {
      justify-content: flex-start;
      margin-top: 6px;
    }
  }
`}</style>


      <div className="appointments-page">
        <h2 className="page-title">Appointments ✂️</h2>

        <div className="summary-bar">
          <div>Today's Appointments: {todayAppointments.length}</div>
          <div>Completed Today: {completedToday.length}</div>
          <div>Total Earnings Today: ₹{todayEarnings}</div>
          <div>Upcoming Appointments: {upcomingCount}</div>
        </div>

        <div className="controls">
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tabs">
          <button
            className={tab === "today" ? "active" : ""}
            onClick={() => setTab("today")}
          >
            Today
          </button>
          <button
            className={tab === "upcoming" ? "active" : ""}
            onClick={() => setTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={tab === "history" ? "active" : ""}
            onClick={() => setTab("history")}
          >
            History
          </button>
        </div>

        <div className="appointments-list">
          {loading && <p>Loading...</p>}
          {!loading && filtered.length === 0 && <p>No appointments found.</p>}

          {filtered.map((a) => (
            <div key={a._id} className="appointment-card">
              <div>
                <p><strong>Name:</strong> {a.name}</p>
                <p><strong>Phone:</strong> {a.phone}</p>
                <p>
                  <strong>Date & Time:</strong>{" "}
                  {new Date(a.startTime).toLocaleDateString()} |{" "}
                  {new Date(a.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                  {new Date(a.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p><strong>Status:</strong> <span className={`status ${a.status}`}>{a.status}</span></p>
                <p><strong>Services:</strong> {(a.services || []).map((s) => s.name).join(", ")}</p>
                <p><strong>Price:</strong> ₹{(a.services || []).reduce((sum, s) => sum + (s.price || 0), 0)}</p>
              </div>

              {a.status === "booked" && (
                <div className="card-actions">
                  <button
                    className="complete-btn"
                    disabled={!hasEnded(a.endTime)}
                    title={hasEnded(a.endTime) ? "Mark as completed" : "You can complete only after service end time"}
                    onClick={() => completeAppointment(a._id)}
                  >
                    Complete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BarberAppointments;
