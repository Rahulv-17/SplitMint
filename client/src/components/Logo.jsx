import React from 'react';

const Logo = ({ className = "h-8 text-primary" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 170 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Icon Group */}
      <g transform="translate(0, 2)">
        {/* Dark Right Half */}
        <path 
          d="M16 0C25 2 30 10 30 16C30 18 29 19.5 27 20C29.5 21.5 28 25 25.5 26C27 28 25 31 16 32V0Z" 
          fill="#374151" 
        />
        {/* Green Left Half (Inherits text color) */}
        <path 
          d="M16 0C7 2 2 10 2 16C2 18 3 19.5 5 20C2.5 21.5 4 25 6.5 26C5 28 7 31 16 32V0Z" 
          fill="currentColor" 
        />
        {/* Diagonal Line */}
        <line x1="-2" y1="30" x2="30" y2="2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Stem */}
        <line x1="16" y1="32" x2="16" y2="36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      
      {/* Text */}
      <text 
        x="42" 
        y="29" 
        fontFamily="Inter, system-ui, sans-serif" 
        fontWeight="800" 
        fontSize="24" 
        fill="currentColor"
        letterSpacing="-0.5"
      >
        SplitMint
      </text>
    </svg>
  );
};

export default Logo;
