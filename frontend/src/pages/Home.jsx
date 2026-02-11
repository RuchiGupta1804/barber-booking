import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-salon.webp";
import haircutImg from "../assets/services/haircut.webp";
import facialImg from "../assets/services/facial.webp";
import makeupImg from "../assets/services/makeup.webp";
import nailsImg from "../assets/services/nails.webp";

const Home = () => {
  const navigate = useNavigate();
  const [currentReview, setCurrentReview] = useState(0);

  const servicesData = [
    {
      title: "Hair Styling",
      desc: "Trendy cuts, smoothening & spa",
      img: haircutImg,
    },
    {
      title: "Facials & Skincare",
      desc: "Glow treatments for every skin type",
      img: facialImg,
    },
    {
      title: "Makeup",
      desc: "Party, bridal & everyday makeup",
      img: makeupImg,
    },
    {
      title: "Nails",
      desc: "Manicure, pedicure & nail art",
      img: nailsImg,
    },
  ];

  const reviews = [
    {
      name: "Ananya Sharma",
      text: "Absolutely loved the service! The staff is very professional and friendly. My hair makeover was perfect.",
    },
    {
      name: "Priya Mehta",
      text: "Booking was super easy and the facial experience was relaxing. Highly recommend MySalon!",
    },
    {
      name: "Ritika Jain",
      text: "Best salon experience I've had in a long time. Clean, calm, and very well managed.",
    },
    {
      name: "Sneha Kapoor",
      text: "Loved the makeup service for my party. The artist understood exactly what I wanted.",
    },
    {
      name: "Neha Verma",
      text: "Great ambience, great service, and very professional staff. Will definitely come again!",
    },
    {
      name: "Pooja Malhotra",
      text: "The nail art was beautiful and long-lasting. Very happy with the overall experience.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffe4ec",
      }}
    >
      {/* HERO SECTION */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem 5rem",
        }}
      >
        {/* LEFT TEXT */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "3.8rem", marginBottom: "1.2rem" }}>
            Welcome to MySalon
          </h1>
          <p
            style={{
              fontSize: "1.4rem",
              marginBottom: "2rem",
              maxWidth: "500px",
            }}
          >
            Book beauty services anytime, anywhere — just for you
          </p>
          <button
            onClick={() => navigate("/book-appointment")}
            style={{
              backgroundColor: "#e91e63",
              color: "#fff",
              border: "none",
              padding: "1rem 2.2rem",
              borderRadius: "30px",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            Book Appointment
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div style={{ flex: 1.1 }}>
          <img
            src={heroImage}
            alt="Salon"
            style={{
              width: "100%",
              maxHeight: "550px",
              objectFit: "contain",
            }}
          />
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2 style={{ marginBottom: "2rem" }}>Our Popular Services 💖</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {servicesData.map((service, index) => (
            <div key={index} style={cardStyle}>
              <div style={imageWrapper}>
                <img
                  src={service.img}
                  alt={service.title}
                  style={serviceImage}
                  className="service-img"
                />
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>

        {/* VIEW ALL SERVICES BUTTON */}
        <div style={{ marginTop: "2.5rem" }}>
          <button
            onClick={() => navigate("/services")}
            style={primaryBtn}
          >
            View All Services
          </button>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>
            Why Choose Us
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "3rem",
            }}
          >
            <div>
              <h3 style={whyTitle}>Experienced Beauty Professionals</h3>
              <p style={whyText}>
                Our certified experts deliver premium beauty services with
                precision, care, and the latest techniques.
              </p>
            </div>

            <div>
              <h3 style={whyTitle}>Effortless Online Booking</h3>
              <p style={whyText}>
                Book appointments in seconds with a smooth, user-friendly
                experience anytime, anywhere.
              </p>
            </div>

            <div>
              <h3 style={whyTitle}>High-Quality Salon Products</h3>
              <p style={whyText}>
                We use only trusted professional-grade brands to ensure safety,
                comfort, and stunning results.
              </p>
            </div>

            <div>
              <h3 style={whyTitle}>Relaxing & Hygienic Ambience</h3>
              <p style={whyText}>
                Enjoy a calm, clean, and welcoming environment designed for your
                ultimate comfort and relaxation.
              </p>
            </div>

            <div>
              <h3 style={whyTitle}>Transparent Pricing</h3>
              <p style={whyText}>
                No hidden charges — you always know exactly what you’re paying
                for before booking.
              </p>
            </div>

            <div>
              <h3 style={whyTitle}>Customer Satisfaction Focus</h3>
              <p style={whyText}>
                We prioritize long-term relationships by delivering consistent
                quality and exceptional client experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ marginBottom: "2.5rem" }}>What Our Clients Say 💬</h2>

        <div style={reviewContainer}>
          <div
            key={currentReview}
            style={{
              ...reviewCard,
              animation: "fadeSlide 0.6s ease",
            }}
          >
            <p style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
              “{reviews[currentReview].text}”
            </p>
            <h4 style={{ marginTop: "1.2rem", color: "#e91e63" }}>
              — {reviews[currentReview].name}
            </h4>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <h2>Ready to glow? ✨</h2>
        <p style={{ margin: "1rem 0" }}>
          Book your appointment today at MySalon
        </p>
        <button
          onClick={() => navigate("/book-appointment")}
          style={primaryBtn}
        >
          Book Now
        </button>
      </section>

      {/* ANIMATIONS */}
      <style>{`
        .service-img {
          transition: transform 0.4s ease;
        }
        .service-img:hover {
          transform: scale(1.08);
        }

        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "1.5rem",
  borderRadius: "14px",
  boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
  textAlign: "center",
};

const imageWrapper = {
  width: "100%",
  height: "160px",
  overflow: "hidden",
  borderRadius: "12px",
  marginBottom: "1rem",
};

const serviceImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const whyTitle = {
  marginBottom: "0.6rem",
  fontSize: "1.25rem",
};

const whyText = {
  margin: 0,
  color: "#555",
  lineHeight: 1.7,
};

const reviewContainer = {
  maxWidth: "700px",
  margin: "0 auto",
};

const reviewCard = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "16px",
  boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
};

const primaryBtn = {
  backgroundColor: "#e91e63",
  color: "#fff",
  border: "none",
  padding: "0.9rem 2.2rem",
  borderRadius: "30px",
  fontSize: "1rem",
  cursor: "pointer",
};

export default Home;
