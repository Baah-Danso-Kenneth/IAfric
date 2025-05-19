'use client'
import { someHeaderData } from '@/lib/data'
import { Search } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi"
import { AiOutlineClose } from "react-icons/ai"
import TrendingTourDropDown from '@/components/content/dropDowns/TrendingTourDropDown'


function SomeHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    // Close mobile menu if open when search is toggled
    if (menuOpen) setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Close search if open when menu is toggled
    if (searchOpen) setSearchOpen(false);
  };

  return (
    <>
      <section>
        <nav className='max-w-7xl flex flex-row mx-auto lg:flex items-center justify-between p-3'>
          {/* Mobile menu toggle */}
          <GiHamburgerMenu 
            className='lg:hidden cursor-pointer text-xl'
            onClick={toggleMenu}
          />
          
          <div>
            <div className='flex items-center gap-10'>
              <h1 className="text-xl font-bold">Bitofric</h1>
              
              {/* Navigation items - hidden in mobile or when search is open */}
              {!searchOpen && someHeaderData.map(({name, href}, index) => (
                <Link key={index+1} href={href} className='hidden lg:block'>
                  <span>{name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile search icon */}
          <Search 
            className='lg:hidden cursor-pointer' 
            onClick={toggleSearch}
          />
          
          {/* Desktop search bar */}
          <div className='hidden lg:block'>
            <div className='flex items-center gap-3 border-black border-2 border-t-0 border-l-0 border-r-0'>
              <Search 
                className="cursor-pointer" 
                onClick={toggleSearch}
              />
              <input 
                type="text" 
                className='border-none focus:border-0 outline-0' 
                placeholder='Where do you want to tour ?' 
              />
              {searchOpen && (
                <AiOutlineClose 
                  className="cursor-pointer" 
                  onClick={toggleSearch}
                />
              )}
            </div>
          </div>
        </nav>
      </section>
      
      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-white py-4 px-6 shadow-md">
          {someHeaderData.map(({name, href}, index) => (
            <Link key={index} href={href} className='block py-2'>
              <span>{name}</span>
            </Link>
          ))}
        </div>
      )}
      
      {/* Trending dropdown when search is active */}
      {searchOpen && <TrendingTourDropDown onClose={toggleSearch} />}
    </>
  )
}

export default SomeHeader