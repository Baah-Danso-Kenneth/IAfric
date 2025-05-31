import React from 'react';

function CircularText() {
  return (
    <div className="relative w-64 h-64 invert">
      {/* SVG for circular text */}
      <svg 
        viewBox="0 0 100 100" 
        width="100%" 
        height="100%" 
        className="absolute inset-0"
      >
        <defs>
          <path 
            id="circle"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" 
          />
        </defs>
        <text className="text-[#8338EC] font-bold">
          <textPath xlinkHref="#circle" className="text-[10px]">
            JOIN ⋆ TRAVEL AFRICA CLUB ⋆ JOIN ⋆ TRAVEL AFRICA CLUB ⋆
          </textPath>
        </text>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h1 className="font-play_flaire text-[25px] leading-tight uppercase">Join</h1>
        <h2 className="font-bowlby text-2xl">Travel Africa Club</h2>
      </div>
    </div>
  );
}

export default CircularText;