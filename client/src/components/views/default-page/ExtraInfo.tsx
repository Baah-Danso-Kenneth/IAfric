import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

function ExtraInfo() {
  return (
    <section className="bg-[#8338EC] py-20">
      <div className="max-w-7xl mx-auto">
        {/* Image Container */}
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]  overflow-hidden">
          <Image 
            src="/images/truck.jpg"
            alt="buzz"
            fill
            className="object-cover"
            priority
          />
        </div>

   
        <div className="max-w-5xl space-y-5 mx-auto mt-10 px-4 text-white text-center">
          <h1 className="text-3xl md:text-4xl uppercase mb-4">
            Lorem ipsum dolor sit amet consectetur.
          </h1>

          <p className="text-base md:text-lg leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi alias veniam hic, 
            minima sint reiciendis dicta odio provident voluptatum. Numquam dicta eum alias 
            cupiditate. Beatae delectus numquam corporis fuga itaque.
          </p>

          <div className='flex items-center justify-center'>
            <Button className='uppercase bg-[#6e2bcc]'>more about us</Button>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ExtraInfo
