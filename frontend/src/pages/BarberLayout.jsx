import { NavLink, useNavigate, Outlet } from "react-router-dom";

const BarberLayout = () => {
  const navigate = useNavigate();
  const barberUser = JSON.parse(localStorage.getItem("barberUser"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("barberUser");
    navigate("/");
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h3 style={{ marginBottom: "1.5rem" }}>✂️ Barber Panel</h3>

        <button onClick={() => navigate("/barber/dashboard")} style={styles.linkBtn}>Dashboard</button>
        <button onClick={() => navigate("/barber/appointments")} style={styles.linkBtn}>Appointments</button>
        <button onClick={() => navigate("/barber/services")} style={styles.linkBtn}>Manage Services</button>
        <button onClick={() => navigate("/barber/leaves")} style={styles.linkBtn}>Leave Days</button>

        <button onClick={logout} style={styles.logout}>Logout</button>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <h2>Welcome, {barberUser?.name || "Beautician"} 👋</h2>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  layout: { display: "flex", minHeight: "100vh" },
  sidebar: {
    width: "220px",
    background: "#000",
    color: "#fff",
    padding: "1.2rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  linkBtn: {
    color: "#fff",
    background: "none",
    border: "none",
    textAlign: "left",
    padding: "0.5rem 0",
    fontWeight: 500,
    cursor: "pointer",
  },
  logout: {
    marginTop: "auto",
    padding: "0.5rem",
    border: "none",
    borderRadius: "6px",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
    fontWeight: "600",
  },
  main: { flex: 1, padding: "2rem", background: "#f7f7f7" },
};

export default BarberLayout;
