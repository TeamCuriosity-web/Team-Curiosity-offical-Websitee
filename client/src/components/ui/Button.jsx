import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
  const baseStyles = "inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black";
  
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800 border border-transparent",
    secondary: "bg-white text-black border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    ghost: "text-gray-600 hover:text-black hover:bg-gray-100 border border-transparent"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
