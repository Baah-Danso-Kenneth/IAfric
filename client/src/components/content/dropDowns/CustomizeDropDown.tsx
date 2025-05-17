import { CustomDropdownProps } from '@/types/regular.dt'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function CustomizeDropDown({
    title,
    items,
    position = 'bottom-left',
    className = '',
    buttonClassName = ''
}: CustomDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Position classes mapping
    const positionClasses: Record<string, string> = {
        'top-left': 'bottom-full left-0 mb-0',
        'top-right': 'bottom-full right-0 mb-0',
        'bottom-left': 'top-full left-0 mt-0',
        'bottom-right': 'top-full right-0 mt-0',
        'left': 'right-full top-0 mr-0',
        'right': 'left-full top-0 ml-0',
    };

    // Get the appropriate position class, defaulting to bottom-left if not found
    const positionClass = position && positionClasses[position] ? positionClasses[position] : positionClasses['bottom-left'];

    return (
        <div className={`relative lg:inline-block ${className}`} ref={dropdownRef}>
            <div className={`absolute z-50 ${positionClass} min-w-max bg-[#8338EC] py-1`}>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href} className='block px-4 py-2 text-[15px] capitalize text-white hover:bg-purple-700'>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default CustomizeDropDown