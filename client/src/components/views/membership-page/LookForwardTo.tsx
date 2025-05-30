import Gallery from "./Gallery"

function LookForwardTo() {
  return (
    <div className='bg-limeGreen bg-texture py-10 lg:py-20'>
      <div className='max-w-7xl mx-auto px-5 lg:px-8'>
        <div className='space-y-8 lg:space-y-12'>
          

          <div className='text-center'>
            <h1 className='text-3xl md:text-4xl lg:text-6xl uppercase  text-electricPurple leading-tight'>
              What to Look Forward To
            </h1>
          </div>

       
          <div className='max-w-4xl mx-auto text-center'>
            <p className='text-base md:text-lg lg:text-xl text-gray-800 leading-relaxed'>
              Experience unforgettable adventures across Africa with our carefully curated travel experiences. 
              From breathtaking landscapes to rich cultural immersion, every journey is designed to create 
              lasting memories and meaningful connections.
            </p>
          </div>


          <div className='pt-6 lg:pt-10'>
            <Gallery />
          </div>

        </div>
      </div>
    </div>
  )
}

export default LookForwardTo