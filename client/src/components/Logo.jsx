import React from 'react';

const Logo = ({ className = "h-8" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="SplitMint Logo" 
        className="h-full w-auto object-contain drop-shadow-[0_0_15px_rgba(0,245,160,0.2)] hover:drop-shadow-[0_0_25px_rgba(0,245,160,0.4)] transition-all duration-300"
        style={{ mixBlendMode: 'lighten' }}
      />
    </div>
  );
};

export default Logo;
