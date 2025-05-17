'use client'

import { dropDownContent, navLinks } from '@/lib/data'
import Link from 'next/link'
import { IoIosCart } from "react-icons/io";
import { GiCancel, GiHamburgerMenu } from "react-icons/gi";
import React, { useState, useRef, useEffect } from 'react'
import MenuPopUp from '../content/dropDowns/MenuPopUp';
import CustomizeDropDown from '../content/dropDowns/CustomizeDropDown';

// Type for dropdown names
type DropdownName = 'about' | 'customize' | 'experience' | 'destination' | null;

export function Header() {
    const [open, setOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<DropdownName>(null);
    const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
    const dropdownContainerRef = useRef<HTMLDivElement>(null);
    
    const toggleMenu = () => {
        setOpen(prev => !prev);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    const handleMouseEnter = (dropdownName: DropdownName) => {
        // Clear any existing timers to prevent the dropdown from closing
        if (dropdownTimerRef.current) {
            clearTimeout(dropdownTimerRef.current);
            dropdownTimerRef.current = null;
        }
        setActiveDropdown(dropdownName);
    };
    
    const handleMouseLeave = () => {
        // Add a small delay before closing the dropdown to allow movement to the dropdown content
        dropdownTimerRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150);
    };

    // Handler for when mouse enters the dropdown content
    const handleDropdownMouseEnter = () => {
        // Clear the close timer if mouse moves to dropdown content
        if (dropdownTimerRef.current) {
            clearTimeout(dropdownTimerRef.current);
            dropdownTimerRef.current = null;
        }
    };

    // Handler for when mouse leaves the dropdown content
    const handleDropdownMouseLeave = () => {
        setActiveDropdown(null);
    };

    // Cleanup timers on component unmount
    useEffect(() => {
        return () => {
            if (dropdownTimerRef.current) {
                clearTimeout(dropdownTimerRef.current);
            }
        };
    }, []);

    // Log available dropdown names for debugging
    useEffect(() => {
        // This will help us identify if 'experience' dropdown content is defined
        console.log('Available dropdowns:', Object.keys(dropDownContent));
    }, []);

    // Safe function to get dropdown items that handles TypeScript checking
    const getDropdownItems = (name: DropdownName) => {
        if (!name) return [];
        
        // Check if data exists for this dropdown name
        const items = (dropDownContent as Record<string, Array<{name: string, href: string}>>)[name];
        
        // If not found, log for debugging
        if (!items) {
            console.log(`No dropdown content found for: ${name}`);
            return [];
        }
        
        return items;
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
                        {navLinks.map(({name, href}, index) => {
                            // Check if this navlink should be a dropdown trigger
                            const lowerName = name.toLowerCase();
                            // Fix: Make sure 'experience' is 'experience' not 'all experience'
                            const normalizedName = lowerName === 'all experience' ? 'experience' : lowerName;
                            const isDropdownTrigger = ['about', 'customize', 'experience', 'destination'].includes(normalizedName);
                            
                            return isDropdownTrigger ? (
                                <div 
                                    key={index}
                                    className='hidden lg:block cursor-pointer relative'
                                    onMouseEnter={() => handleMouseEnter(normalizedName as DropdownName)}
                                    onMouseLeave={handleMouseLeave}
                                    ref={normalizedName === activeDropdown ? dropdownContainerRef : null}
                                >
                                    <span>{name}</span>
                                    
                                    {/* The dropdown will be visible when it's the active dropdown */}
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
                                                className="mt-0"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href={href} key={index} className='hidden lg:flex'>
                                    <span>{name}</span>
                                </Link>
                            );
                        })}

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