import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const BarberLeaves = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [isFullDay, setIsFullDay] = useState(true);
  const [slots, setSlots] = useState([{ start: "", end: "" }]);
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    const res = await axiosInstance.get("/leaves");
    setLeaves(res.data);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAddSlot = () => {
    setSlots([...slots, { start: "", end: "" }]);
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const handleSave = async () => {
    if (!selectedDate) return alert("Select a date");

    if (!isFullDay) {
      for (const s of slots) {
        if (!s.start || !s.end || s.start >= s.end) {
          return alert("End time must be later than start time");
        }
      }
    }

    await axiosInstance.post("/leaves", {
      date: selectedDate,
      isFullDay,
      slots: isFullDay ? [] : slots,
    });

    alert("Leave saved");
    setSelectedDate("");
    setIsFullDay(true);
    setSlots([{ start: "", end: "" }]);
    fetchLeaves();
  };

  const handleCancelLeave = async (id) => {
    if (!window.confirm("Cancel this leave?")) return;
    await axiosInstance.delete(`/leaves/${id}`);
    fetchLeaves();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Leave Days</h2>
      <p>Mark days when you are unavailable. Appointments will be blocked automatically.</p>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <div style={{ marginTop: "12px" }}>
        <select
          value={isFullDay ? "full" : "partial"}
          onChange={(e) => setIsFullDay(e.target.value === "full")}
        >
          <option value="full">Full Day</option>
          <option value="partial">Partial Day</option>
        </select>
      </div>

      {!isFullDay && (
        <div style={{ marginTop: "15px" }}>
          <h4>Blocked Time Slots</h4>

          {slots.map((slot, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <input
                type="time"
                value={slot.start}
                onChange={(e) =>
                  handleSlotChange(index, "start", e.target.value)
                }
              />
              {" "}to{" "}
              <input
                type="time"
                value={slot.end}
                onChange={(e) =>
                  handleSlotChange(index, "end", e.target.value)
                }
              />
            </div>
          ))}

          <button onClick={handleAddSlot}>+ Add Slot</button>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSave}>Add</button>
      </div>

      {/* ---------- SAVED LEAVES ---------- */}
      <div style={{ marginTop: "30px" }}>
        <h3>Upcoming Leave Days</h3>

        {leaves.length === 0 ? (
          <p>No leave days added. You are fully available for bookings.</p>
        ) : (
          leaves.map((leave) => (
            <div
              key={leave._id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{leave.date}</strong>{" "}
                {leave.isFullDay
                  ? "(Full Day)"
                  : leave.slots.map((s, i) => (
                      <span key={i}>
                        {s.start}-{s.end}{" "}
                      </span>
                    ))}
              </div>

              <button
                onClick={() => handleCancelLeave(leave._id)}
                style={{
                  background: "#c0392b",
                  color: "#fff",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BarberLeaves;
