import React, { useEffect, useRef, useState } from "react";
import SlotPicker from "../components/booking/SlotPicker";
import API from "../services/api";
import { useLocation } from "react-router-dom";

export default function BookAppointment() {
  const location = useLocation();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const statusRef = useRef(null);

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalTime = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // ---------------- LOAD SERVICES (✅ ONLY ACTIVE SERVICES) ----------------
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/services", { params: { user: "true" } });
        setServices(res.data.services || res.data);
      } catch (err) {
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ---------------- PRESELECT SERVICE ----------------
  useEffect(() => {
    if (services.length && location.state?.service) {
      setSelectedServices([location.state.service]);
    }
  }, [services, location.state]);

  useEffect(() => {
    if (status && statusRef.current)
      statusRef.current.scrollIntoView({ behavior: "smooth" });
  }, [status]);

  // ---------------- SERVICE TOGGLE ----------------
  const toggleService = (service) => {
    setSelectedSlot(null);

    setSelectedServices((prev) => {
      const exists = prev.find((s) => s._id === service._id);
      return exists
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service];
    });

    setErrors((e) => ({ ...e, services: "" }));
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    else if (!/^[A-Za-z]+ [A-Za-z]+$/.test(name.trim()))
      newErrors.name = "Enter first name and last name";

    if (!phone) newErrors.phone = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(phone))
      newErrors.phone = "Enter valid 10-digit mobile number";

    if (!date) newErrors.date = "Date is required";
    else {
      const d = new Date(date + "T00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d.getDay() === 4) newErrors.date = "Store is closed on Thursdays";
      else if (d < today) newErrors.date = "Cannot select past date";
    }

    if (selectedServices.length === 0)
      newErrors.services = "Select at least one service";

    if (!selectedSlot) newErrors.slot = "Please select a time slot";

    setErrors(newErrors);
    setTouched({
      name: true,
      phone: true,
      date: true,
      services: true,
      slot: true,
    });

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({
        behavior: "smooth",
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleShowReview = () => {
    if (!validateForm()) return;
    setShowReview(true);
    setStatus("");
  };

  // ---------------- SLOT RANGE LABEL ----------------
  const getSlotRangeLabel = (slot, totalTime) => {
  if (!slot) return "";
  const start = new Date(slot.startTime);
  const end = new Date(start.getTime() + totalTime * 60000);

  const format = (d) =>
    d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

  return `${format(start)} - ${format(end)}`;
};

  // ---------------- BOOKING ----------------
  const handleBooking = async () => {
    if (!validateForm()) return;

    setStatus("");
    try {
      await API.post("/appointments/book", {
        startTime: selectedSlot.startTime,
        services: selectedServices.map((s) => s._id),
        name,
        phone,
      });

      setBookingConfirmed(true);
      setStatus("✅ Appointment booked successfully!");
      setErrors({});
      setTouched({});
      setShowReview(true);
      setSelectedSlot(null);
      setSelectedServices([]);
      setName("");
      setPhone("");
      setDate("");
    } catch (err) {
      console.error("Booking error:", err);
      setStatus(err.response?.data?.message || "❌ Booking failed. Try again.");
    }
  };

  if (loading) return <p>Loading Book Appointment...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "1100px", margin: "auto", padding: "20px" }}>
      <h2>Book Appointment</h2>

      {/* STATUS */}
      {status && (
        <div
          ref={statusRef}
          style={{
            marginBottom: "12px",
            padding: "10px",
            borderRadius: "6px",
            background: status.includes("success") ? "#dcfce7" : "#fee2e2",
            color: status.includes("success") ? "#166534" : "#991b1b",
          }}
        >
          {status}
        </div>
      )}

      {/* NAME */}
      <div id="name">
        <label>Your Name</label>
        <input
          type="text"
          value={name}
          placeholder="First Last"
          onChange={(e) => {
            let value = e.target.value;
            if (!/^[A-Za-z ]*$/.test(value)) return;
            value = value
              .split(" ")
              .map((word) =>
                word
                  ? word.charAt(0).toUpperCase() +
                    word.slice(1).toLowerCase()
                  : ""
              )
              .join(" ");
            setName(value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, name: true }));
            const parts = name.trim().split(" ").filter(Boolean);
            if (parts.length < 2)
              setErrors((prev) => ({
                ...prev,
                name: "Please enter first name and last name",
              }));
          }}
          style={{ width: "100%", padding: "6px", marginTop: "5px" }}
        />
        {touched.name && errors.name && (
          <p style={{ color: "red" }}>{errors.name}</p>
        )}
      </div>

      {/* PHONE */}
      <div id="phone" style={{ marginTop: "12px" }}>
        <label>Phone Number</label>
        <input
          type="tel"
          value={phone}
          placeholder="10-digit mobile number"
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length === 1 && !/[6-9]/.test(value)) return;
            if (value.length > 10) return;
            setPhone(value);
            setErrors((prev) => ({ ...prev, phone: "" }));
          }}
          onBlur={() => {
            setTouched((t) => ({ ...t, phone: true }));
            if (phone.length < 10)
              setErrors((p) => ({
                ...p,
                phone: "Mobile number must contain 10 digits",
              }));
          }}
          style={{ width: "100%", padding: "6px", marginTop: "5px" }}
        />
        {touched.phone && errors.phone && (
          <p style={{ color: "red" }}>{errors.phone}</p>
        )}
      </div>

      {/* DATE */}
      <div id="date" style={{ marginTop: "12px" }}>
        <label>Select Date</label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => {
            const d = new Date(e.target.value + "T00:00");
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            setDate(e.target.value);
            if (d.getDay() === 4)
              setErrors((prev) => ({
                ...prev,
                date: "Store is closed on Thursdays",
              }));
            else if (d < today)
              setErrors((prev) => ({
                ...prev,
                date: "Cannot select past date",
              }));
            else setErrors((prev) => ({ ...prev, date: "" }));
          }}
          onBlur={() => setTouched((t) => ({ ...t, date: true }))}
          style={{ width: "100%", padding: "6px", marginTop: "5px" }}
        />
        {(touched.date || errors.date) && errors.date && (
          <p style={{ color: "red" }}>{errors.date}</p>
        )}
      </div>

      {/* SERVICES */}
      <div id="services" style={{ marginTop: "25px" }}>
        <h3>Select Services</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "1rem",
            marginTop: "10px",
          }}
        >
          {services.map((s) => {
            const isSelected = selectedServices.some(
              (x) => x._id === s._id
            );

            return (
              <div
                key={s._id}
                onClick={() => toggleService(s)}
                style={{
                  cursor: "pointer",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: isSelected
                    ? "0 0 0 3px #bf5a7b"
                    : "0 2px 6px rgba(0,0,0,0.15)",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                  transition: "0.15s",
                  background: "#fff",
                }}
              >
                <img
                  src={`http://localhost:5000${s.image}`}
                  alt={s.name}
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                  }}
                />

                <div style={{ padding: "10px", textAlign: "center" }}>
                  <p style={{ fontWeight: "600", marginBottom: "4px" }}>
                    {s.name}
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "#555" }}>
                    ₹{s.price} • {s.duration} mins
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {touched.services && errors.services && (
          <p style={{ color: "red", marginTop: "6px" }}>{errors.services}</p>
        )}
      </div>

      {/* TOTAL SUMMARY */}
      {selectedServices.length > 0 && (
        <div style={{ marginTop: "12px", marginBottom: "12px" }}>
          <p>
            <strong>Total Time:</strong> {totalTime} mins{" "}
            <strong>Total Price:</strong> ₹{totalPrice}
          </p>
        </div>
      )}

      {/* SLOT PICKER */}
      {date && (
        <SlotPicker
          date={date}
          serviceIds={selectedServices.map((s) => s._id)}
          selectedSlot={selectedSlot}
          onSelect={setSelectedSlot}
        />
      )}
      {touched.slot && errors.slot && (
        <p style={{ color: "red" }}>{errors.slot}</p>
      )}

      {/* REVIEW BUTTON */}
      {selectedServices.length > 0 && date && selectedSlot && (
        <button
          onClick={handleShowReview}
          style={{ padding: "10px 20px", marginTop: "12px", cursor: "pointer" }}
        >
          Review & Book
        </button>
      )}

      {/* REVIEW MODAL */}
      {showReview && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "500px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowReview(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>

            <h3>Confirm Your Appointment</h3>

            {bookingConfirmed ? (
              <>
                <p style={{ color: "#166534", fontWeight: "bold" }}>
                  ✅ Appointment booked successfully!
                </p>
                <button
                  onClick={() => {
                    setShowReview(false);
                    setBookingConfirmed(false);
                    window.location.href = "/";
                  }}
                  style={{
                    padding: "10px 20px",
                    marginTop: "10px",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>Name:</strong> {name}
                </p>
                <p>
                  <strong>Phone:</strong> {phone}
                </p>
                <p>
                  <strong>Date:</strong> {date}
                </p>
                <p>
                  <strong>Time Slot:</strong>{" "}
                  {getSlotRangeLabel(selectedSlot, totalTime)}
                </p>
                <p>
                  <strong>Services:</strong>{" "}
                  {selectedServices.map((s) => s.name).join(", ")}
                </p>
                <p>
                  <strong>Total Time:</strong> {totalTime} mins
                </p>
                <p>
                  <strong>Total Price:</strong> ₹{totalPrice}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "15px",
                  }}
                >
                  <button
                    onClick={() => setShowReview(false)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#f3f4f6",
                      color: "#111827",
                      border: "1px solid #d1d5db",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleBooking}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Confirm Booking
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
