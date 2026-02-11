import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Services from "./pages/Services";
import BookAppointment from "./pages/BookAppointment";
import Profile from "./pages/Profile";

// Barber
import BarberLogin from "./pages/BarberLogin";
import BarberDashboard from "./pages/BarberDashboard";
import BarberHome from "./pages/BarberHome";
import BarberAppointments from "./pages/BarberAppointments";
import BarberServices from "./pages/BarberServices";
import BarberLeaves from "./pages/BarberLeaves";
import BarberLayout from "./pages/BarberLayout";

import ProtectedBarberRoute from "./components/ProtectedBarberRoute";

function App() {
  const location = useLocation();

  const isBarberRoute =
    location.pathname.startsWith("/barber") ||
    location.pathname.startsWith("/barber-login");

  return (
    <>
      {!isBarberRoute && <Navbar />}

      <Routes>
        {/* CUSTOMER ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/profile" element={<Profile />} />

        {/* BARBER AUTH */}
        <Route path="/barber-login" element={<BarberLogin />} />

        {/* BARBER PANEL */}
        <Route
          path="/barber"
          element={
            <ProtectedBarberRoute>
              <BarberLayout />
            </ProtectedBarberRoute>
          }
        >
          <Route index element={<BarberDashboard />} />
          <Route path="dashboard" element={<BarberDashboard />} />
          <Route path="appointments" element={<BarberAppointments />} />
          <Route path="services" element={<BarberServices />} />
          <Route path="leaves" element={<BarberLeaves />} />
        </Route>
      </Routes>

      {!isBarberRoute && <Footer />}
    </>
  );
}

export default App;
