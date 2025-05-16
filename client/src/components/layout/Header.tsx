'use client'

import { navLinks } from '@/lib/data'
import Link from 'next/link'
import { IoIosCart } from "react-icons/io";
import { GiCancel, GiHamburgerMenu } from "react-icons/gi";
import React, { useState } from 'react'
import MenuPopUp from '../content/dropDowns/MenuPopUp';

export function Header() {
    const [open, setOpen] = useState(false);

    const toggleMenu = () => {
        setOpen(prev => !prev);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    return (
        <header className='relative w-full bg-[#8338EC] text-white'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex items-center justify-between p-5'>
                  
                    {open ? (
                        <GiCancel onClick={toggleMenu} className='lg:hidden text-3xl'/>
                    ) : (
                        <GiHamburgerMenu onClick={toggleMenu} className='lg:hidden text-3xl'/>
                    )}
                    
      
                    <div className='flex-shrink-0'>
                        <h1>bitofrc</h1>
                    </div>

         
                    <nav className='flex items-center capitalize space-x-8 text-[18px] font-extralight'>
                        {navLinks.map(({name, href}, index) => (
                            <Link href={href} key={index} className='hidden lg:flex'>
                                {name}
                            </Link>
                        ))}

                  
                        <div className='flex items-center'>
                            <Link href="/cart" className='group'>
                                <div className='relative flex items-center space-x-2'>
                                    <IoIosCart className='text-2xl'/>
                                    <span className='text-[15px] md:text-[18px] font-dmMono rounded-full'>0</span>
                                </div>
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>

        
            {open && (
                <MenuPopUp isOpen={true} onClose={closeMenu} />
            )}
        </header>
    )
}