import React, { useState } from "react";
import { forgotPassword } from "../services/authService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword({ email });
      toast.success("Password reset link sent!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center">
      <form className="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <input
          className="w-full p-2 border rounded mb-2"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          className="w-full mt-6 cursor-pointer"
          isLoading={isLoading}
          onClick={handleSubmit}
          type="submit"
        >
          Send Reset Link
        </Button>
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
