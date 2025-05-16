'use client'

import { navLinks, subMenus } from '@/lib/data';
import { MenuPopUpProps } from '@/types/regular.dt';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa6';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";





function MenuPopUp({ onClose, isOpen = true }: MenuPopUpProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // Reset state when menu closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setActiveSubmenu(null);
        setIsAnimating(false);
      }, 300);
    }
  }, [isOpen]);

  const handleNavItemClick = (sectionName: string) => {
    if (subMenus[sectionName]) {
      setIsAnimating(true);
      setActiveSubmenu(sectionName);
      setTimeout(() => setIsAnimating(false), 300); 
    }
  };

  const handleBackClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveSubmenu(null);
      setIsAnimating(false);
    }, 300); // Match this with CSS transition time
  };

  // If isOpen is explicitly false, don't render
  if (isOpen === false) return null;

  return (
    <div className="lg:hidden fixed inset-0 w-full bg-[#8338EC] p-5 h-full z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md h-3/4 overflow-hidden">

        <div 
          className={`absolute inset-0 flex flex-col uppercase items-center justify-center gap-8 transition-transform duration-300 ${
            activeSubmenu ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          {navLinks.map((section, index) => (
            <div key={index} className="w-full max-w-xs ">
              {subMenus[section.name] ? (
                <button 
                  onClick={() => handleNavItemClick(section.name)}
                  className="flex items-center justify-between w-full text-xl font-medium text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span className='capitalize'>{section.name}</span>
                  <MdKeyboardDoubleArrowRight className="text-white" />
                </button>
              ) : (
                <Link 
                  href={section.href}
                  className="flex items-center justify-between w-full text-xl font-medium text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={onClose}
                >
                  <span className='capitalize'>{section.name}</span>
                </Link>
              )}
            </div>
          ))}
        </div>

  
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ${
            activeSubmenu ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {activeSubmenu && (
            <>
              <button 
                onClick={handleBackClick}
                className="flex items-center gap-2 text-xl font-medium text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors w-full max-w-xs"
              >
                <FaChevronLeft />
                <span>Back</span>
              </button>
              
              <div className="w-full max-w-xs flex flex-col gap-4 capitalize">
                {subMenus[activeSubmenu]?.map((item, idx) => (
                  <Link 
                    key={idx}
                    href={item.href}
                    className="flex items-center justify-between w-full text-xl font-medium text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={onClose}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      

      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-white text-xl p-2 hover:bg-purple-700 rounded-full"
          aria-label="Close menu"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default MenuPopUp;