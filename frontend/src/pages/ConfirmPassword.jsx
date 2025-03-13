import React, { useState } from "react";
import { useNavigate, useParams  } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../services/authService"; // Import resetPassword function

const ConfirmPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    
    
     const { token } = useParams(); 
    console.log(token);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const response = await resetPassword(token, { password });
            toast.success(response.data.message);
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">New Password</label>
                        <input 
                            type="password" 
                            className="w-full px-3 py-2 border rounded-lg" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Confirm Password</label>
                        <input 
                            type="password" 
                            className="w-full px-3 py-2 border rounded-lg" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ConfirmPassword;
