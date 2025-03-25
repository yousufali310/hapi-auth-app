import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import ConfirmPassword from "./pages/ConfirmPassword";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./pages/AdminDashboard";

const storedUser = JSON.parse(localStorage.getItem("user"));

const isAuthenticated = () => !!localStorage.getItem("token");

const isAdmin = () => storedUser.role === "admin";

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};
console.log(isAdmin(), isAuthenticated());

const AdminRoute = ({ children }) => {
  return isAuthenticated() && isAdmin() ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirm-password/:token" element={<ConfirmPassword />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
