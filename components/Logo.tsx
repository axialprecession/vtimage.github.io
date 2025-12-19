
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Lens/Shutter Container */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="currentColor" 
          strokeWidth="6" 
        />

        {/* Shutter Blades - Simple geometric cuts to imply aperture without clutter */}
        <path d="M50 5 L62 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M92 35 L65 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M92 78 L62 65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 95 L38 65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M8 78 L35 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M8 22 L38 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

        {/* Microphone (Voice) - Centered and clear */}
        <g transform="translate(50, 50)">
           {/* Mic Body */}
           <rect x="-9" y="-15" width="18" height="26" rx="9" fill="currentColor" />
           {/* Mic Details (Grille) - using negative space (white lines) to show detail on the solid fill */}
           <line x1="-5" y1="-8" x2="5" y2="-8" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
           <line x1="-5" y1="-3" x2="5" y2="-3" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
           <line x1="-5" y1="2" x2="5" y2="2" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
           
           {/* Mic Stand/Holder */}
           <path d="M-11 4 Q -11 15 0 15 Q 11 15 11 4" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
           <line x1="0" y1="15" x2="0" y2="22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
           <line x1="-8" y1="22" x2="8" y2="22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
