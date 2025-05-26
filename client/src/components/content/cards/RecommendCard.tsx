import clsx from 'clsx';
import React from 'react';

function RecommendCard({ name, testimony}: { name: string; testimony: string}) {
  return (
    <div className="w-[350px] h-auto relative flex flex-col">
  
      <div className="bg-[#8338EC] p-6  flex-grow relative">
        <p className="text-sm text-white relative pl-3 pr-1">
          {testimony}
        </p>
        
     
        <div
          className="w-0 h-0 absolute -bottom-1 right-2
                    border-l-[30px] border-r-[20px] border-t-[20px] transform rotate-[210deg]
                    border-l-transparent border-r-transparent border-t-[#59289e]"
        />
      </div>
      

      <div className="h-[50px] flex items-center justify-end px-4 mt-6">
        <p className="text-right font-light italic text-sm">
          — {name}
        </p>
      </div>
    </div>
  );
}

export default RecommendCard;