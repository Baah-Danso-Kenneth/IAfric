'use client'

import React, { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import Image from 'next/image'
import { navLinks } from '@/lib/data'
import Link from 'next/link'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import AllTourDropDown from './allTourDropDown'
import SearchInputPanel from './SearchInputPanel'

function Header() {
  const pathname = usePathname()
  const [openSearch, setOpenSearch] = useState(false)
  const [openAll, setOpenAll] = useState(false)

  return (
    <div className="relative h-10 lg:h-auto z-50 bg-[#000] text-white ">
      <div className="mx-5 flex items-center gap-20 relative z-50">
        
        <div className="w-[30%] flex items-center justify-center gap-20">
          <div className="w-[30%] flex items-center">
              <Link  href="/" className='absolute  '>
                 <Image src="/images/bitoga.png" className=' h-20 lg:h-44 lg:scale-125 object-contain' alt="app-img" width={100} height={100}/>
              </Link>
          </div>

         
          <div
            onClick={() => setOpenSearch((prev) => !prev)}
            className={clsx(
              ' w-[70%] hidden items-center p-2 rounded-2xl cursor-pointer transition-all lg:flex',
              openSearch ? 'bg-white' : 'bg-[#262626]'
            )}
          >
            <Search className={clsx('w-5 h-5', openSearch ? 'text-black' : 'text-white')} />
            <input
              type="text"
              onClick={(e) => e.stopPropagation()}
              className={clsx(
                'outline-none ml-2 w-full bg-transparent',
                openSearch ? 'text-black' : 'text-white'
              )}
            />
          </div>
        </div>


    <div className="w-[70%]  hidden lg:flex">
        {navLinks.map((item, index) => {
  const isAllExperience = item.name.toLowerCase() === 'all experience';

  return isAllExperience ? (
    
    <button
      key={index}
      className={clsx(
        `py-5 px-10 border-l capitalize text-nowrap border-zinc-800 first:border-zinc-800 ${
          index === navLinks.length - 1 ? 'border-r' : ''
        } flex items-center`,
        {
          'bg-softBlend uppercase': pathname === item.href,
        }
      )}
    >
      <span className="flex items-center">
        {item.name}
        <ChevronDown 
        onClick={() => setOpenAll((prev) => !prev)}
        className="ml-2 w-4 h-4 cursor-pointer"
         />
      </span>
    </button>
  ) : (
 
    <Link
      key={index}
      href={item.href}
      className={clsx(
        `py-5 px-10 border-l capitalize text-nowrap border-zinc-800 first:border-zinc-800 ${
          index === navLinks.length - 1 ? 'border-r' : ''
        } flex items-center`,
        {
          'bg-softBlend uppercase': pathname === item.href,
        }
      )}
    >
      {item.name}
    </Link>
  );
})}

        </div>
      </div>

      {openAll && (
        <>
        <div className='fixed inset-0 z-40' onClick={()=>setOpenAll(false)}></div>
        <div className="absolute top-16 right-[25%] z-50">
          <AllTourDropDown />
        </div>
        </>
      )}

    
      {openSearch && (
        <>

          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm  z-40"
            onClick={() => setOpenSearch(false)}
          ></div>


          <div className="absolute top-16 left-[10%] z-50">
            <SearchInputPanel />
          </div>
        </>
      )}
    </div>
  )
}

export default Header
