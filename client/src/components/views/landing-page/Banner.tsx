import React from 'react'
import Image from 'next/image'

function Banner() {
  return (
    <div className='relative w-full h-screen'>
          <Image alt="" src="/images/clique.jpg" fill className="object-cover"/>
        </div>
  )
}

export default Banner