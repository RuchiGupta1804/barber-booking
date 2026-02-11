import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>My Salon</h2>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        {/* <Link to="/beauticians" style={styles.link}>Beautician</Link> */}
        <Link to="/services" style={styles.link}>Services</Link>
        <Link to="/book-appointment" style={styles.link}>Book Appointment</Link>
        {/* <Link to="/login" style={styles.link}>Login</Link> */}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: "#000",
    color: "#fff",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { margin: 0 },
  links: { display: "flex", gap: "1.5rem" },
  link: { color: "#fff", textDecoration: "none" },
};

export default Navbar;
