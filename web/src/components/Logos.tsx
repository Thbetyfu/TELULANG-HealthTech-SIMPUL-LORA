import React from 'react';

export const SimpulLogoSvg: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer Interconnected Node Knot Paths */}
    <path 
      d="M30 20 H70 C80 20 80 30 80 40 V60 C80 70 70 80 60 80 H40 C30 80 20 70 20 60 V40 C20 30 30 20 40 20 Z" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M35 35 L65 65 M65 35 L35 65" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round" 
    />
    {/* Node Dots */}
    <circle cx="35" cy="35" r="5" fill="currentColor" />
    <circle cx="65" cy="35" r="5" fill="currentColor" />
    <circle cx="35" cy="65" r="5" fill="currentColor" />
    <circle cx="65" cy="65" r="5" fill="currentColor" />
    <circle cx="50" cy="50" r="7" fill="currentColor" />
  </svg>
);

export const LoraLogoSvg: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Geometric Medical Box */}
    <path 
      d="M50 20 L80 35 V65 L50 80 L20 65 V35 Z" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinejoin="round" 
    />
    <path d="M50 20 V80 M20 35 L50 50 L80 35" stroke="currentColor" strokeWidth="4" />
    {/* Medical Cross */}
    <path d="M50 38 V62 M38 50 H62" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    {/* Swift Wings */}
    <path d="M15 30 L5 20 M18 42 L2 35 M85 30 L95 20 M82 42 L98 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const SimpulLoraUnifiedLogoSvg: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
    <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="5" />
    <path d="M50 20 V80 M20 50 H80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);
