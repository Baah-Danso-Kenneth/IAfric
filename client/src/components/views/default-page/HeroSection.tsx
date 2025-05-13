import Image from 'next/image'


export function HeroSection () {
    return(
         <div className='relative w-full h-screen'>
            <Image
             src="/images/hero-img.jpg"
             alt="Hero background"
             fill
             priority
             className='object-cover'
            />

            {/* <div className="absolute inset-0 bg-black/30" /> */}
            
          <div className='absolute inset-x-0 top-0 flex  justify-center'>
                <div className="text-center px-4 md:px-8 mt-16 ">
                    <h1 className='text-3xl md:text-5xl lg:text-6xl text-white '>Lets take you on a trip to Africa</h1>
                </div>
            </div> 
         </div>
    )
}