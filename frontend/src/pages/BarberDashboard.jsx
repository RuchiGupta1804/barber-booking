import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  getLeaveAffectedAppointments,
  cancelAppointmentByBarber,
} from "../services/api";

const BarberDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    revenueToday: 0,
    totalRevenue: 0,
    nextTime: null,
    servicesCount: 0,
    leaveToday: false,
  });

  const [countdown, setCountdown] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [affectedAppointments, setAffectedAppointments] = useState([]);

  const fetchDashboard = async () => {
    try {
      const summary = await getDashboardSummary();
      const todayStr = new Date().toISOString().split("T")[0];
      const affected = await getLeaveAffectedAppointments(todayStr);

      const now = new Date();

      const upcoming = (summary.upcomingAppointments || [])
        .filter((a) => a.status === "booked")
        .map((a) => ({
          ...a,
          startTimeObj: new Date(a.startTime),
          endTimeObj: new Date(a.endTime),
        }))
        .filter((a) => a.startTimeObj > now)
        .sort((a, b) => a.startTimeObj - b.startTimeObj);

      setStats({
        total: summary.totalAppointments || 0,
        today: summary.todayAppointmentsCount || 0,
        revenueToday: summary.todayRevenue || 0,
        totalRevenue: summary.totalRevenue || 0,
        nextTime: upcoming[0] ? upcoming[0].startTimeObj : null,
        servicesCount: summary.totalServices || 0,
        leaveToday: summary.leaveToday || false,
      });

      setUpcomingAppointments(upcoming);
      setAffectedAppointments(
        (affected || []).filter((a) => a.status === "booked")
      );
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!stats.nextTime) {
      setCountdown(null);
      return;
    }

    const interval = setInterval(() => {
      const diff = Math.max(
        0,
        Math.floor((stats.nextTime.getTime() - Date.now()) / 1000)
      );
      setCountdown(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [stats.nextTime]);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment and notify user?")) return;

    try {
      await cancelAppointmentByBarber(id);
      await fetchDashboard();
      alert("Appointment cancelled and user notified");
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Cancel failed");
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null) return "No upcoming";
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div>
      {/* ---------- STATS CARDS ---------- */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <h4>Total Appointments</h4>
          <p style={styles.number}>{stats.total}</p>
        </div>

        <div style={styles.card}>
          <h4>Today’s Appointments</h4>
          <p style={styles.number}>{stats.today}</p>
        </div>

        <div style={styles.card}>
          <h4>Services Count</h4>
          <p style={styles.number}>{stats.servicesCount}</p>
        </div>

        <div style={styles.card}>
          <h4>Today’s Revenue</h4>
          <p style={styles.number}>₹{stats.revenueToday}</p>
        </div>

        <div style={styles.card}>
          <h4>Total Revenue</h4>
          <p style={styles.number}>₹{stats.totalRevenue}</p>
        </div>

        <div style={styles.card}>
          <h4>Next Appointment In</h4>
          <p style={styles.number}>
            {countdown !== null ? formatTime(countdown) : "No upcoming"}
          </p>
        </div>
      </div>

      {/* ---------- 🚨 LEAVE AFFECTED ---------- */}
      {affectedAppointments.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ color: "#c62828" }}>⚠️ Appointments to Cancel (Leave)</h3>
          <div style={styles.upcomingList}>
            {affectedAppointments.map((a) => (
              <div
                key={a._id}
                style={{ ...styles.upcomingCard, border: "2px solid #c62828" }}
              >
                <p>
                  <strong>{a.name}</strong> ({a.phone})
                </p>
                <p>Services: {a.services?.map((s) => s.name).join(", ")}</p>
                <p>
                  Time: {new Date(a.startTime).toLocaleString()} –{" "}
                  {new Date(a.endTime).toLocaleTimeString()}
                </p>
                <button
                  onClick={() => handleCancel(a._id)}
                  style={{
                    marginTop: "0.5rem",
                    background: "#c62828",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Confirm Cancel & Notify
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- UPCOMING ---------- */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Upcoming Appointments</h3>
        {upcomingAppointments.length === 0 ? (
          <p>No upcoming appointments</p>
        ) : (
          <div style={styles.upcomingList}>
            {upcomingAppointments.map((a) => (
              <div key={a._id} style={styles.upcomingCard}>
                <p>
                  <strong>{a.name}</strong> ({a.phone})
                </p>
                <p>
                  Services: {a.services?.map((s) => s.name).join(", ") || "N/A"}
                </p>
                <p>
                  Start: {a.startTimeObj.toLocaleString()} | Duration:{" "}
                  {Math.ceil((a.endTimeObj - a.startTimeObj) / 60000)} min
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  card: {
    background: "#fff",
    padding: "1.2rem",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  number: { fontSize: "1.8rem", fontWeight: "700", marginTop: "0.5rem" },
  upcomingList: { display: "flex", flexDirection: "column", gap: "0.8rem" },
  upcomingCard: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
  },
};

export default BarberDashboard;
