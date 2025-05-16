'use client'

import { footerLinks, retro } from '@/lib/data';
import { Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { FaBoltLightning } from "react-icons/fa6";

export default function Footer() {

  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  const toggleSection = (index:any) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }

  return (
    <section className='py-10 border-t-2 border-black bg-[#c5e7c0]'>
      <div className='mx-auto max-w-[95%]'>
      
        <div className='hidden lg:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 text-sm'>
          {footerLinks.map((section, index) => (
            <div key={index+1} className="mb-8">
              <h1 className='uppercase font-bold mb-4'>{section.title}</h1>
              <ul className="space-y-3 flex flex-col">
                {section.links.map((link, linkIndex) => (
                  <Link href={link.href} key={linkIndex} className="capitalize">
                    <span className="hover-underline-animation">
                      {link.name}
                    </span>
                  </Link>
                ))}
              </ul>
              
              {section.title === 'contacts' && (
                <div className="mt-4 flex space-x-4 text-2xl">
                  <FaFacebook /> 
                  <FaInstagram /> 
                  <FaXTwitter/> 
                </div>
              )}
            </div>
          ))}
        </div>

     
        <section className='max-w-7xl mx-auto'>
        <div className='lg:hidden space-y-4 '>
          {footerLinks.map((section, index) => (
            <div key={index+1} className="border-b border-black pb-2 ">
              <div 
                className='flex items-center justify-between cursor-pointer py-2 text-sm'
                onClick={() => toggleSection(index)}
              >
                <h1 className='uppercase font-medium'>{section.title}</h1>
                {openSections[index] ? 
                  <Minus className="h-4 w-4" /> : 
                  <Plus className="h-4 w-4" />
                }
              </div>

              {openSections[index] && (
                <div className="pl-2 py-2 space-y-3 animate-fadeIn">
                  {section.links.map((link, linkIndex) => (
                    <div key={linkIndex}>
                      <Link href={link.href} className="capitalize block hover:text-gray-600">
                        <span className='text-[15px]'>{link.name}</span>
                      </Link>
                    </div>
                  ))}
                  
                  {section.title === 'contacts' && (
                    <div className="mt-2 flex space-x-4 text-xl">
                      <FaFacebook /> 
                      <FaInstagram /> 
                      <FaXTwitter/> 
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        </section>

        <section className='space-y-3'>

        <div className='mt-5 lg:mt-0 flex items-center space-x-2 uppercase text-[12px] md:text-base'>
         <h1>Travel around africa </h1>
          <FaBoltLightning className='text-[#8338EC] text-[15px] md:text-3xl'/>
           <h1> with lightning</h1>
        </div>

          <div className='flex items-center flex-wrap'>
            {retro.map((items,index)=>(
              <div>
              <Link href={items.path} key={index}>
                <span className='capitalize text-[10px]'>{items.name}</span>
              </Link>
               {index < retro.length -1 && (
                <span className='mx-3 text-gray-500'>|</span>
               )}
              </div>
            ))}
          </div>

          <div className='text-[12px]'>
            <h1>Web ID: 905733184</h1>
            <p>&copy; Travel Africa with lighten. all rights reserved.</p>
          </div>

      </section>


      </div>
    </section>
  );
}


