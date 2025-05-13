import React from 'react'

export function HeroSection({title,main_image}:{title:string,main_image:string | null}) {
    return (
      <div
        className="relative h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${main_image})` }}
      >
      
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-5xl md:text-8xl capitalize text-center">
            {title}
          </h1>
        </div>
      </div>
    );
  }
  