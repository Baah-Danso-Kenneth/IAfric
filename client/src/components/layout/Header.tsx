'use client'

import { dropDownContent, navLinks } from '@/lib/data'
import Link from 'next/link'
import { IoIosCart } from "react-icons/io";
import { GiCancel, GiHamburgerMenu } from "react-icons/gi";
import React, { useState, useRef, useEffect } from 'react'
import MenuPopUp from '../content/dropDowns/MenuPopUp';
import CustomizeDropDown from '../content/dropDowns/CustomizeDropDown';
import Image from 'next/image'
import { usePathname } from 'next/navigation';


type DropdownName = 'about' | 'customize' | 'experience' | 'destination' | null;

export function Header() {
    const [open, setOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<DropdownName>(null);
    const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
    const dropdownContainerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    
    const toggleMenu = () => {
        setOpen(prev => !prev);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    const handleMouseEnter = (dropdownName: DropdownName) => {
        if (dropdownTimerRef.current) {
            clearTimeout(dropdownTimerRef.current);
            dropdownTimerRef.current = null;
        }
        setActiveDropdown(dropdownName);
    };
    
    const handleMouseLeave = () => {
        dropdownTimerRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150);
    };

    const handleDropdownMouseEnter = () => {
        if (dropdownTimerRef.current) {
            clearTimeout(dropdownTimerRef.current);
            dropdownTimerRef.current = null;
        }
    };

    const handleDropdownMouseLeave = () => {
        setActiveDropdown(null);
    };

    useEffect(() => {
        return () => {
            if (dropdownTimerRef.current) {
                clearTimeout(dropdownTimerRef.current);
            }
        };
    }, []);


    const isLinkActive = (href: string) => {
        if (href === '/' && pathname === '/') return true;
        if (href !== '/' && pathname.startsWith(href)) return true;
        return false;
    };

    const getDropdownItems = (name: DropdownName) => {
        if (!name) return [];
        
        const items = (dropDownContent as Record<string, Array<{name: string, href: string}>>)[name];
        
        if (!items) {
            console.log(`No dropdown content found for: ${name}`);
            return [];
        }
        
        return items;
    };

    return (
        <header className='w-full bg-[#8338EC] text-white'>
            <div className='max-w-7xl mx-auto'>
                <div className='px-5 relative flex items-center lg:px-20 justify-between '>
                  
                    {/* Mobile Menu Toggle */}
                    <div className='lg:hidden flex items-center'>
                        {open ? (
                            <GiCancel onClick={toggleMenu} className='text-3xl'/>
                        ) : (
                            <GiHamburgerMenu onClick={toggleMenu} className='text-3xl'/>
                        )}
                    </div>
                    
 
                    <Link href="/" className='flex items-center'>
                        <Image 
                            src="/images/logo.svg" 
                            alt="app-logo" 
                            width={0}
                            height={0}
                            className="w-auto h-12 sm:h-14 md:h-16 object-contain scale-200 "
                            priority
                        />
                    </Link>
                   

                    {/* Navigation */}
                    <nav className='flex items-center capitalize space-x-8 text-[18px] font-extralight'>
                        {navLinks.map(({name, href}, index) => {
                            const lowerName = name.toLowerCase();
                            const normalizedName = lowerName === 'all experience' ? 'experience' : lowerName;
                            const isDropdownTrigger = ['about', 'customize', 'experience', 'destination'].includes(normalizedName);
                            const isActive = isLinkActive(href);
                            
                            return isDropdownTrigger ? (
                                <div 
                                    key={index}
                                    className='hidden lg:block cursor-pointer relative'
                                    onMouseEnter={() => handleMouseEnter(normalizedName as DropdownName)}
                                    onMouseLeave={handleMouseLeave}
                                    ref={normalizedName === activeDropdown ? dropdownContainerRef : null}
                                >
                                    <span className={`hover:text-gray-200 transition-colors duration-200 relative pb-1 ${
                                        isActive ? 'border-b-2 border-white' : ''
                                    }`}>
                                        {name}
                                    </span>
                                    
                                    {activeDropdown === normalizedName && (
                                        <div 
                                            className="absolute z-50 left-0 top-full min-w-max"
                                            onMouseEnter={handleDropdownMouseEnter}
                                            onMouseLeave={handleDropdownMouseLeave}
                                        >
                                            <CustomizeDropDown 
                                                title={name}
                                                items={getDropdownItems(normalizedName as DropdownName)} 
                                                position="bottom-left"
                                                className="mt-0 -top-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href={href} key={index} className='hidden lg:flex hover:text-gray-200 transition-colors duration-200'>
                                    <span className={`relative pb-1 ${
                                        isActive ? 'border-b-2 border-white' : ''
                                    }`}>
                                        {name}
                                    </span>
                                </Link>
                            );
                        })}

                        {/* Cart */}
                        <div className='flex items-center'>
                            <Link href="/cart" className='group'>
                                <div className={`relative flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200 pb-1 ${
                                    pathname === '/cart' ? 'border-b-2 border-white' : ''
                                }`}>
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