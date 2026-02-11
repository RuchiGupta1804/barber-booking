const ServiceCard = ({ service }) => {
  return (
    <div className="service-card-pro">
      <div className="image-box">
        <img
          src={`http://localhost:5000${service.image}`}
          alt={service.name}
          className="service-img"
        />
        <div className="service-overlay">
          <h3>{service.name}</h3>
          <span>₹{service.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
