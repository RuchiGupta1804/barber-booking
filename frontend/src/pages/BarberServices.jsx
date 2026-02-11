import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const BarberServices = () => {
  const [services, setServices] = useState([]);

  // Add form
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("General");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Edit
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // ✅ SORT FILTERS ONLY
  const [priceSort, setPriceSort] = useState("");
  const [durationSort, setDurationSort] = useState("");

  const loadServices = async () => {
    const res = await axios.get("/services");
    setServices(res.data);
  };

  useEffect(() => {
    loadServices();
  }, []);

  // ✅ ADD
  const handleAddService = async () => {
    try {
      setError("");
      setLoading(true);

      if (!name || !duration || !price || !imageFile) {
        setError("All fields including image required");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("duration", duration);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", imageFile);

      await axios.post("/services", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setDuration("");
      setPrice("");
      setCategory("General");
      setImageFile(null);
      document.getElementById("imageInput").value = "";

      loadServices();
    } catch (err) {
      setError("Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  // ✅ EDIT
  const handleEditClick = (service) => {
    setEditingId(service._id);
    setEditName(service.name);
    setEditDuration(service.duration);
    setEditPrice(service.price);
    setEditCategory(service.category || "General");
  };

  const handleUpdate = async (id) => {
    await axios.put(`/services/${id}`, {
      name: editName,
      duration: editDuration,
      price: editPrice,
      category: editCategory,
    });
    setEditingId(null);
    loadServices();
  };

  // ✅ TOGGLE ACTIVE / INACTIVE
  const toggleActive = async (id) => {
    await axios.patch(`/services/${id}/toggle`);
    loadServices();
  };

  // ✅ SORT LOGIC
  const sortedServices = [...services].sort((a, b) => {
    if (priceSort === "low") return a.price - b.price;
    if (priceSort === "high") return b.price - a.price;
    if (durationSort === "low") return a.duration - b.duration;
    if (durationSort === "high") return b.duration - a.duration;
    return 0;
  });

  const activeServices = sortedServices.filter((s) => s.isActive);
  const inactiveServices = sortedServices.filter((s) => !s.isActive);

  return (
    <div style={{ padding: "2rem", background: "#f6f8fb", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "1rem" }}>💈 Service Management</h2>

      {/* ---------- SORT BAR ---------- */}
      <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <select value={priceSort} onChange={(e) => setPriceSort(e.target.value)} style={inputSmall}>
          <option value="">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>

        <select value={durationSort} onChange={(e) => setDurationSort(e.target.value)} style={inputSmall}>
          <option value="">Sort by Duration</option>
          <option value="low">Short → Long</option>
          <option value="high">Long → Short</option>
        </select>
      </div>

      {/* ---------- ADD FORM ---------- */}
      <div style={formCard}>
        <h4 style={{ marginBottom: "0.7rem" }}>➕ Add New Service</h4>

        <input placeholder="Service Name" value={name} onChange={(e) => setName(e.target.value)} style={input} />
        <input type="number" placeholder="Duration (mins)" value={duration} onChange={(e) => setDuration(e.target.value)} style={input} />
        <input type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} style={input} />
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} style={input} />

        <input type="file" id="imageInput" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ marginBottom: "0.7rem" }} />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={handleAddService} disabled={loading} style={primaryBtn}>
          {loading ? "Saving..." : "Add Service"}
        </button>
      </div>

      {/* ---------- ACTIVE SERVICES ---------- */}
      <h3 style={{ marginTop: "2rem", marginBottom: "0.6rem" }}>🟢 Active Services</h3>

      <div style={grid}>
        {activeServices.length === 0 && <p style={{ color: "#888" }}>No active services</p>}

        {activeServices.map((service) => (
          <div key={service._id} style={card}>
            <img src={`http://localhost:5000${service.image}`} alt={service.name} style={imageStyle} />

            {editingId === service._id ? (
              <>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} style={inputSmall} />
                <input type="number" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} style={inputSmall} />
                <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} style={inputSmall} />
                <input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} style={inputSmall} />

                <div style={{ marginTop: "0.4rem" }}>
                  <button onClick={() => handleUpdate(service._id)} style={successBtn}>Save</button>
                  <button onClick={() => setEditingId(null)} style={grayBtn}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h4 style={{ margin: "0.3rem 0" }}>{service.name}</h4>
                <p style={{ margin: "0.2rem 0" }}>⏱ {service.duration} mins</p>
                <p style={{ margin: "0.2rem 0" }}>₹ {service.price}</p>
                <p style={{ margin: "0.2rem 0", fontSize: "0.85rem" }}>📂 {service.category}</p>

                <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <ToggleSwitch checked={service.isActive} onChange={() => toggleActive(service._id)} />
                  <button onClick={() => handleEditClick(service)} style={infoBtn}>Edit</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ---------- INACTIVE SERVICES ---------- */}
      <h3 style={{ marginTop: "2.5rem", marginBottom: "0.6rem" }}>🔴 Inactive Services</h3>

      <div style={grid}>
        {inactiveServices.length === 0 && <p style={{ color: "#888" }}>No inactive services</p>}

        {inactiveServices.map((service) => (
          <div key={service._id} style={{ ...card, opacity: 0.6 }}>
            <img src={`http://localhost:5000${service.image}`} alt={service.name} style={imageStyle} />

            <h4 style={{ margin: "0.3rem 0" }}>{service.name}</h4>
            <p style={{ margin: "0.2rem 0" }}>⏱ {service.duration} mins</p>
            <p style={{ margin: "0.2rem 0" }}>₹ {service.price}</p>
            <p style={{ margin: "0.2rem 0", fontSize: "0.85rem" }}>📂 {service.category}</p>

            <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <ToggleSwitch checked={service.isActive} onChange={() => toggleActive(service._id)} />
              <button onClick={() => handleEditClick(service)} style={infoBtn}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- TOGGLE SWITCH ---------------- */

const ToggleSwitch = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: "44px",
      height: "22px",
      background: checked ? "#27ae60" : "#ccc",
      borderRadius: "22px",
      position: "relative",
      cursor: "pointer",
      transition: "0.25s",
    }}
  >
    <div
      style={{
        width: "18px",
        height: "18px",
        background: "#fff",
        borderRadius: "50%",
        position: "absolute",
        top: "2px",
        left: checked ? "24px" : "2px",
        transition: "0.25s",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    />
  </div>
);

/* ---------------- STYLES ---------------- */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
  gap: "1.1rem",
};

const formCard = {
  background: "#fff",
  padding: "1rem",
  borderRadius: "12px",
  maxWidth: "420px",
  marginBottom: "2rem",
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
};

const card = {
  background: "#fff",
  borderRadius: "14px",
  padding: "0.7rem",
  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
};

const imageStyle = {
  width: "100%",
  height: "140px",
  objectFit: "cover",
  borderRadius: "10px",
};

const input = {
  width: "100%",
  padding: "0.5rem",
  marginBottom: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const inputSmall = {
  padding: "0.4rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const primaryBtn = {
  background: "#2c3e50",
  color: "#fff",
  border: "none",
  padding: "0.45rem 0.8rem",
  borderRadius: "6px",
  cursor: "pointer",
};

const successBtn = {
  background: "#27ae60",
  color: "#fff",
  border: "none",
  padding: "0.35rem 0.6rem",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "0.4rem",
};

const infoBtn = {
  background: "#2980b9",
  color: "#fff",
  border: "none",
  padding: "0.35rem 0.6rem",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "0.4rem",
};

const grayBtn = {
  background: "#7f8c8d",
  color: "#fff",
  border: "none",
  padding: "0.35rem 0.6rem",
  borderRadius: "6px",
  cursor: "pointer",
};

export default BarberServices;
