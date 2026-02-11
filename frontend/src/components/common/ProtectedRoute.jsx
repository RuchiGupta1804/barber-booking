import { Navigate } from "react-router-dom";   // 1️⃣ Import Navigate to redirect
import { useAuth } from "../../hooks/useAuth"; // 2️⃣ Import your custom hook to get user info

const ProtectedRoute = ({ children }) => {   // 3️⃣ children = components you want to protect
  const { user } = useAuth();                // 4️⃣ Get user from AuthContext

  // 5️⃣ If user exists → render children
  // 6️⃣ If no user → redirect to /login
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;               // 7️⃣ Export to use in routes
