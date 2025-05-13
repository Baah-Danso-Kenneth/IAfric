import React from 'react'

function PeopleTaught({ name, testimony }: { name: string; testimony: string }) {
    return (
      <div className=" w-[350px] h-auto relative ">

        <div className="bg-[#5da6a5] p-10  w-full">
          <p className="text-sm text-white">{testimony}</p>
        </div>
  
        <div
          className="w-0 h-0 absolute top-[68%] right-3 border-l-[20px] border-r-[20px] border-b-[20px] 
          border-l-transparent border-r-transparent border-[#36827d]
          transform rotate-[28deg] "
        />
        <div className="text-right font-light italic w-full mt-5">-{name}</div>
      </div>
    )
  }
  

export default PeopleTaught