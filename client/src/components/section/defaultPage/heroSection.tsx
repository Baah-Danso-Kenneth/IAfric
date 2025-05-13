import Header from '@/components/Header/Header'
import { Button } from '@/components/ui/button'
import React from 'react'

function HeroSection() {
  return (
    <div className="relative h-[50vh] lg:h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/sunset.jpg')" }}>

 
       <h1 className='font-play_flaire text-[2em] text-center text-white capitalize lg:text-[8em]'>Explore ghana</h1>
       <div className='relative'>
        <div className='flex flex-col items-center justify-center space-y-5'>
          <p className='w-[70%] text-[15px] md:text-[20px] text-white z-10'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae accusantium architecto at mollitia eum quis molestias delectus debitis deleniti officia 
            cumque incidunt dicta fugit, dolore vero magni aspernatur? Veritatis, ut!</p>
            <Button className='button-cutout ml-20 lg:ml-0'>lets&apos; go</Button>
        </div>

       </div>
    </div>
  )
}

export default HeroSection