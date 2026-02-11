import { useEffect, useState } from "react";
import { getAllAppointments } from "../services/api";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getAllAppointments();
      setAppointments(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Appointment History</h2>

      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Services</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.name}</td>
                <td>{a.phone}</td>
                <td>{a.services.map((s) => s.name).join(", ")}</td>
                <td>{new Date(a.startTime).toLocaleDateString()}</td>
                <td>
                  {new Date(a.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>{a.totalDuration} mins</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentHistory;
