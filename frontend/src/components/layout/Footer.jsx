import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div>
          <h3>My Salon</h3>
          <p>Glow with confidence ✨</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <p>
            <Link to="/" style={styles.link}>
              Home
            </Link>
          </p>
          <p>
            <Link to="/services" style={styles.link}>
              Services
            </Link>
          </p>
          <p>
            <Link to="/book-appointment" style={styles.link}>
              Book Appointment
            </Link>
          </p>
          <p>
            <Link to="/barber-login" style={styles.link}>
              Barber Login
            </Link>
          </p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>📍 Mumbai, India</p>
          <p>📞 +91 9876543210</p>
          <p>✉️ mysalon@email.com</p>
        </div>
      </div>

      <div style={styles.copy}>© 2026 My Salon. All rights reserved.</div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "#000",
    color: "#fff",
    marginTop: "0",
    paddingTop: "2rem",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 2rem 2rem",
    flexWrap: "wrap",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  copy: {
    borderTop: "1px solid #333",
    textAlign: "center",
    padding: "1rem",
  },
};

export default Footer;
