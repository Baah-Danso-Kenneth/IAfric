'use client'

import { useState, useEffect } from 'react';

function OurDataSimpleData({ 
  image, 
  title, 
  description 
}: { 
  image: string; 
  title: string; 
  description: string 
}) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Handle responsive behavior
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
  
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center p-4 ">
      <div className={`relative ${isMobile ? 'w-16 h-16' : 'w-24 h-24'} mb-4 overflow-hidden rounded-full`}>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <h2 className="text-xl uppercase mb-2 text-center text-gray-800">
        {title}
      </h2>
      
      <p className="text-center text-zinc-800 max-w-sm ">
        {description}
      </p>
    </div>
  );
}

// Default export
export default OurDataSimpleData;