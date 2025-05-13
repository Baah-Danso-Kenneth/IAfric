import React from 'react'

function DataForInfo({title, description}:{title:string; description:string}) {
  return (
    <div className='space-y-3 text-white'>
        <h1 className='text-3xl lg:text-6xl font-dmMono uppercase text-center'>{title}</h1>
        <p className='text-center font-polt_waski italic text-[13px] lg:text-[16px]'>{description}</p>
    </div>
  )
}

export default DataForInfo