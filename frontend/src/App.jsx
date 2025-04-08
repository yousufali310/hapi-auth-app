import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ConfirmPassword from './pages/ConfirmPassword';

import Dashboard from './pages/Dashboard';
import FileManagementApp from './pages/File';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './Layout';
import { useEffect } from 'react';
import { useRef } from 'react';

const storedUser = JSON.parse(localStorage.getItem('user'));

const getUser = () => JSON.parse(localStorage.getItem('user'));
const isAuthenticated = () => !!localStorage.getItem('token');
const isAdmin = () => getUser()?.role === 'admin';

export const PrivateRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    toast.error('Please login to access this page.');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const location = useLocation();
  const hasShownToast = useRef(false); // this prevents double toast

  useEffect(() => {
    if (!hasShownToast.current) {
      if (!isAuthenticated()) {
        toast.error('Please login to access this page.');
      } else if (!isAdmin()) {
        toast.error('You are not authorized to access this page.');
      }
      hasShownToast.current = true;
    }
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Public Routes (Without Navbar) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirm-password/:token" element={<ConfirmPassword />} />

        {/* Protected Routes (With Navbar) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="files" element={<FileManagementApp />} />

          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
