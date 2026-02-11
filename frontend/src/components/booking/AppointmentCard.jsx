const AppointmentCard = ({ appointment }) => {
  return (
    <div className="card">
      <p>Barber: {appointment.barberId?.userId?.name}</p>
      <p>
        {new Date(appointment.startTime).toLocaleString()} -{" "}
        {new Date(appointment.endTime).toLocaleString()}
      </p>
      <p>Status: {appointment.status}</p>
    </div>
  );
};

export default AppointmentCard;
