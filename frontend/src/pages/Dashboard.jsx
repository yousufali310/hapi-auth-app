import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Custom Icon Components
const UserIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const LogoutIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
    />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <rect
      x="7"
      y="4"
      width="10"
      height="16"
      rx="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="18" r="1" fill="currentColor" />
  </svg>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }, 500);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "UN";
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-50 p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-2xl shadow-md">
              {getInitials(user.name)}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {getGreeting()}, {user.name}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-12 h-12 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center shadow-md cursor-pointer"
            >
              {isLoading ? (
                <span className="animate-spin">↻</span>
              ) : (
                <LogoutIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {/* User Details Card */}
          <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
            <UserIcon className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">User ID</p>
              <p className="font-semibold text-blue-800">{user.id || "N/A"}</p>
            </div>
          </div>

          {/* Time Card */}
          <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-3">
            <ClockIcon className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Phone No.</p>
              <p className="font-semibold text-green-800 text-sm">
                {user.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
