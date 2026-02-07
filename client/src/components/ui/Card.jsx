import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div 
      className={`
        bg-white rounded-lg border border-border p-6
        ${hover ? 'transition-all duration-200 hover:shadow-md hover:border-black/20' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
