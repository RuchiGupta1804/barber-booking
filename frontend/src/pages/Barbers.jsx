import { useEffect, useState } from "react";
import { getBarbers } from "../services/api";

const Barbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const data = await getBarbers();
        setBarbers(data);
      } catch (err) {
        setError("Failed to load barbers");
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Loading barbers...</p>;
  if (error) return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Our Beauticians 💖</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {barbers.map((barber) => (
          <div
            key={barber._id}
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "1.2rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <h3>{barber.userId?.name || "Staff"}</h3>
            <p>Email: {barber.userId?.email}</p>
            <p>
              Working Hours: {barber.workingHours.start} -{" "}
              {barber.workingHours.end}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Barbers;
