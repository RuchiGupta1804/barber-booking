import { Navigate } from "react-router-dom";

const ProtectedBarberRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const barberUser = JSON.parse(localStorage.getItem("barberUser"));

  if (!token || !barberUser || barberUser.role !== "staff") {
    return <Navigate to="/barber-login" replace />;
  }

  return children;
};

export default ProtectedBarberRoute;
