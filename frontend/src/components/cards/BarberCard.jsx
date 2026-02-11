const BarberCard = ({ barber, onSelect }) => {
  return (
    <div className="card" onClick={() => onSelect(barber)}>
      <h3>{barber.userId?.name}</h3>
      <p>
        {barber.workingHours.start} - {barber.workingHours.end}
      </p>
    </div>
  );
};

export default BarberCard;
