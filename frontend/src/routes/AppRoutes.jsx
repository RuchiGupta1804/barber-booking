import { Routes, Route, useLocation } from "react-router-dom";

// Pages
import Home from "../pages/Home";
import Services from "../pages/Services";
import Barbers from "../pages/Barbers";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BookAppointment from "../pages/BookAppointment";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/barbers" element={<Barbers />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
    </Routes>
  );
};

export default AppRoutes;
