import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name || "User"}!</h1>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
