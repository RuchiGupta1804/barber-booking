import React, { useEffect, useState } from "react";
import API from "../../services/api";

const SlotPicker = ({ date, serviceIds, selectedSlot, onSelect }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }

    setLoading(true);

    API.get("/appointments/available-slots", {
      params: {
        date,
        serviceIds: serviceIds?.length ? serviceIds.join(",") : "none",
      },
    })
      .then((res) => {
        setSlots(res.data.slots || []);
      })
      .catch((err) => {
        console.error("Slot fetch error:", err);
        setSlots([]);
      })
      .finally(() => setLoading(false));
  }, [date, serviceIds]);

  const getSlotColor = (available, reason, isSelected) => {
    if (isSelected) return "#bf5a7b";
    if (!available && reason === "Booked") return "#9ca3af";
    if (!available && reason === "Beautician unavailable") return "#6b7280";
    if (!available && reason === "Time passed") return "#94a3b8";
    if (!available && reason === "Exceeds closing time") return "#4b5563";
    if (!available && reason === "Time conflict") return "#7c2d12";
    if (!available && reason === "Salon closed") return "#374151";
    return "#8d043a";
  };

  return (
    <div>
      <h3>Available Slots</h3>
      {loading && <p>Loading slots...</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {slots.map((slot, i) => {
          const isSelected =
            selectedSlot && selectedSlot.startTime === slot.startTime;

          return (
            <button
              key={i}
              disabled={!slot.available}
              onClick={() => slot.available && onSelect(slot)}
              style={{
                backgroundColor: getSlotColor(
                  slot.available,
                  slot.reason,
                  isSelected
                ),
                color: "#fff",
                padding: "0.6rem",
                borderRadius: "8px",
                minWidth: "170px",
                border: "none",
                fontWeight: "600",
                cursor: slot.available ? "pointer" : "not-allowed",
              }}
            >
              {new Date(slot.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              <br />
              {!slot.available && (
                <span style={{ fontSize: "0.75rem" }}>{slot.reason}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SlotPicker;
