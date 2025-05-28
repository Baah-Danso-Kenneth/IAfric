import { outTro } from '@/lib/data'
import Link from 'next/link'
import React from 'react'

function Description() {
  return (
    <section className='py-16 md:py-20 lg:py-20  bg-[#c5e7c0]'>

        <div className='max-w-4xl mx-auto'>
          
          <div className='text-center mb-8'>
            <h1 className='uppercase text-2xl md:text-3xl lg:text-4xl text-[#8338EC]'>Lorem ipsum dolor sit amet consectetur </h1>
          </div>
        </div>

        <div className='px-5 max-w-5xl mx-auto space-y-5 text-center'>
          <p className='text-[15px] md:text-[18px] lg:text-[20px]'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto sequi qui, ad possimus quia voluptatibus vero ratione corporis dicta neque? Quisquam voluptate consectetur, facilis eum consequuntur harum similique eos voluptates veritatis, neque tenetur fugit est quasi ipsam dolor voluptatem aperiam fugiat quo eius incidunt nam voluptas cupiditate! Debitis, ab amet!</p>
          <p className='text-[15px] md:text-[18px] lg:text-[20px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti maiores neque numquam quis commodi libero, quas consequatur eveniet eius corporis.</p>
          <p className='font-bold'>Scroll and click on the tiles below to learn more about them!</p>
        </div>

        <div className="py-10 flex items-center flex-wrap justify-center space-x-2 text-lg text-[#8338EC]">
         {outTro.map(({ name, query }, index) => (
          <React.Fragment key={index}>
           <Link href={query} className="underline text-sm md:text-[18px] lg:text-[20px] uppercase">
           {name}
          </Link>
           {index !== outTro.length - 1 && <span className="mx-2">|</span>}
         </React.Fragment>
        ))}
      </div>


    </section>
  )
}

export default Description