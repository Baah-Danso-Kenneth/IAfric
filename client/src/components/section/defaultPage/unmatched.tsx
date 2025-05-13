import React from 'react'
import Image from 'next/image'


function Unmatched() {
  return (
    <div className='my-10 p-5'>
        <div className='flex items-start justify-between '>
            <div className='flex-1'>
                <h1 className='uppercase'>akwaabaa</h1>
            </div>

            <div className='flex-3'>
                <h1 className='font-play_flaire text-5xl capitalize'>let&apos;s welcome you to the gate way of africa</h1>
            </div>

            <div className='flex-3'>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At assumenda fugit reiciendis, tempore veniam vitae et minima sapiente ipsa! Reprehenderit 
                    temporibus, eligendi quibusdam autem expedita fugiat blanditiis ullam ad laboriosam.</p>
            </div>
            
        </div>


        <div className="flex gap-4 w-full py-10">
            <div className="basis-[10%] h-80 overflow-hidden">
            <Image src="/images/sunset.jpg" alt="" width={500} height={500} className="w-full h-full object-cover rounded-3xl" />
            </div>
        <div className="basis-[20%] h-80 overflow-hidden">
         <Image src="/images/sunset.jpg" alt="" width={500} height={500} className="w-full h-full object-cover rounded-3xl" />
        </div>
  <div className="basis-[30%] h-80 overflow-hidden">
    <Image src="/images/sunset.jpg" alt="" width={500} height={500} className="w-full h-full object-cover rounded-3xl" />
  </div>
  <div className="basis-[40%] h-80 overflow-hidden">
    <Image src="/images/sunset.jpg" alt="" width={500} height={500} className="w-full h-full object-cover rounded-3xl" />
  </div>
</div>



    </div>
  )
}

export default Unmatched