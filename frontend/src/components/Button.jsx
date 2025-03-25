import React from "react";

const Button = ({ children, isLoading, className = "", ...props }) => (
  <button
    {...props}
    className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 
      bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
      text-white disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    disabled={isLoading}
  >
    {isLoading ? (
      <div className="flex items-center justify-center">
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {children}
      </div>
    ) : (
      children
    )}
  </button>
);

export default Button;
