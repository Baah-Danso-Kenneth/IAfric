import OurDataSimpleData from '@/components/content/common/OurDataSimpleData'
import { ourStyleData } from '@/lib/data'
import React from 'react'

function OurWay() {
  return (
    <section className='bg-[#FFE066] py-10'>
      <div className='max-w-4xl mx-auto text-zinc-500'>
        <div className='text-center mb-8'>
          <h1 className='uppercase text-3xl md:text-4xl lg:text-5xl text-wrap'>
            the <span className='font-delight_mother capitalize text-3xl lg:text-6xl mx-2'>travel Afrique</span> way
          </h1>
        </div>

        <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {ourStyleData.map((item, index) => (
            <div key={index} className='flex items-center justify-center'>
              <OurDataSimpleData 
                image={item.image}
                title={item.title}
                description={item.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurWay