import { destinationLinks } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function AllTourDropDown() {
  return (
<div className='w-[400px] border-[#F2F2F4] bg-black border shadow-lg p-10 rounded-2xl z-50'>
  <div className='grid grid-cols-2 gap-4'>
    {destinationLinks.map(({ title, image }, index) => (
      <Link
        href={`/destination/${encodeURIComponent(title)}`}
        key={index}
        className='group flex items-center gap-3 p-2 rounded-lg hover:bg-amber-100 transition'
      >
        <div className="w-10 h-10 overflow-hidden">
          <Image
            src={image}
            alt='region-map'
            width={50}
            height={50}
            className='object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1'
          />
        </div>
        <h1 className='text-[#000] text-[12px] uppercase font-extralight group-hover:text-amber-500'>
          {title}
        </h1>
      </Link>
    ))}
  </div>
</div>


  )
}

export default AllTourDropDown