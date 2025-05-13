import React from 'react'
import Image from 'next/image'

function VisitGhana() {
  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/sunset.jpg')" }}>
        <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />     

        <div className='flex items-center justify-center flex-col pt-20 space-y-3'>
            <h1 className='text-5xl font-play_flaire text-white'>Visit us an you will be amazed</h1>
            <p className='w-[40%]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, iste corrupti eaque laudantium esse blanditiis in repudiandae necessitatibus officiis aliquid.</p>
        </div>

<div className='h-[70vh] relative'>
  {/* Big ones */}
  <Image src="/images/sunset.jpg" alt="" width={300} height={300} className="absolute top-5 left-5 rounded-full object-cover h-60 w-60" />
  <Image src="/images/sunset.jpg" alt="" width={300} height={300} className="absolute bottom-0 right-0 rounded-full object-cover h-56 w-56" />
  <Image src="/images/sunset.jpg" alt="" width={300} height={300} className="absolute top-5 right-12 rounded-full object-cover h-52 w-52" />
  
  {/* Medium ones */}
  <Image src="/images/sunset.jpg" alt="" width={200} height={200} className="absolute bottom-0 right-80 rounded-full object-cover h-40 w-40" />
  <Image src="/images/sunset.jpg" alt="" width={200} height={200} className="absolute bottom-0 left-10 rounded-full object-cover h-36 w-36" />
  <Image src="/images/sunset.jpg" alt="" width={200} height={200} className="absolute  top-20 right-80 rounded-full object-cover h-56 w-56" />

  {/* Center + overlap */}
  <Image src="/images/sunset.jpg" alt="" width={150} height={150} className="absolute top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover h-28 w-28 z-10" />
  <Image src="/images/sunset.jpg" alt="" width={100} height={100} className="absolute top-30 left-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover h-56 w-56 z-10" />

  {/* Small ones */}
  <Image src="/images/sunset.jpg" alt="" width={80} height={80} className="absolute top-10 left-1/3 rounded-full object-cover h-16 w-16" />
  <Image src="/images/sunset.jpg" alt="" width={80} height={80} className="absolute bottom-20 right-1/3 rounded-full object-cover h-16 w-16" />
  <Image src="/images/sunset.jpg" alt="" width={60} height={60} className="absolute top-[70%] left-[10%] rounded-full object-cover h-12 w-12" />
  <Image src="/images/sunset.jpg" alt="" width={60} height={60} className="absolute top-[80%] right-[15%] rounded-full object-cover h-12 w-12" />

  {/* Extra tiny ones */}

  <Image src="/images/sunset.jpg" alt="" width={80} height={80} className="absolute top-[40%] left-[50%] bottom-0 rounded-full object-cover h-40 w-40" />
  <Image src="/images/sunset.jpg" alt="" width={80} height={80} className="absolute bottom-20 right-1/3 rounded-full object-cover h-16 w-16" />
  <Image src="/images/sunset.jpg" alt="" width={60} height={60} className="absolute top-[70%] left-[10%] rounded-full object-cover h-12 w-12" />
  <Image src="/images/sunset.jpg" alt="" width={60} height={60} className="absolute top-[80%] right-[15%] rounded-full object-cover h-12 w-12" />

  <Image src="/images/sunset.jpg" alt="" width={40} height={40} className="absolute top-[30%]  bottom-50 right-[5%] rounded-full object-cover h-8 w-8" />
  <Image src="/images/sunset.jpg" alt="" width={40} height={40} className="absolute bottom-50  left-[45%] rounded-full object-cover h-8 w-8" />

  <Image src="/images/sunset.jpg" alt="" width={200} height={200} className="absolute bottom-0 right-80 rounded-full object-cover h-40 w-40" />
  <Image src="/images/sunset.jpg" alt="" width={200} height={200} className="absolute bottom-0 right-[70%] rounded-full object-cover h-36 w-36" />
  <Image src="/images/sunset.jpg" alt="" width={200} height={200} className="absolute  bottom-0 right-[50%] rounded-full object-cover h-56 w-56" />

</div>


    </div>
  )
}

export default VisitGhana