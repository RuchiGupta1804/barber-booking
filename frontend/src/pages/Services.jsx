import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

const Services = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("/services?user=true"); // 🔥 only active
      setServices(res.data);
    };
    load();
  }, []);

  const handleClick = (service) => {
    navigate("/book-appointment", { state: { service } });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Our Services</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "1.2rem",
        }}
      >
        {services.map((s) => (
          <div
            key={s._id}
            onClick={() => handleClick(s)}
            style={{
              cursor: "pointer",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
              background: "#fff",
            }}
          >
            <img
              src={`http://localhost:5000${s.image}`}
              alt={s.name}
              style={{ width: "100%", height: "160px", objectFit: "cover" }}
            />

            <div style={{ padding: "0.8rem", textAlign: "center" }}>
              <h4 style={{ margin: "0.3rem 0" }}>{s.name}</h4>
              <p style={{ margin: "0.2rem 0", color: "#666" }}>
                {s.duration} mins
              </p>
              <p style={{ margin: "0.2rem 0", fontWeight: "600" }}>
                ₹{s.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
