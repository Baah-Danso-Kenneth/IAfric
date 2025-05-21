'use client'

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  text: string;
  linkText: string;
  linkUrl: string;
}

interface Carousel {
  slides: Slide[];
}

interface TextCarouselProps {
  carousels: Carousel[];
}

export default function TextCarousel({ carousels }: TextCarouselProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  const activeSlides = carousels[carouselIndex]?.slides ?? [];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % activeSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % activeSlides.length);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);

  const currentSlide = activeSlides[slideIndex];

  return (
    <div className="w-full text-center  flex flex-row items-center  px-4 ">


      <div className="flex gap-2 lg:gap-10">
        <button
          onClick={prevSlide}
          className="p-1 rounded-full hover:bg-gray-300"
        >
          <ChevronLeft size={18} />
        </button>


<div
  key={slideIndex}
  className="text-sm text-nowrap font-medium transition-opacity duration-500 ease-in-out opacity-100 animate-fade"
>
  {currentSlide?.text}{' '}
  <a
    href={currentSlide?.linkUrl}
    className="text-blue-600 underline hover:text-blue-800"
  >
    {currentSlide?.linkText}
  </a>
</div>


        <button
          onClick={nextSlide}
          className="p-1  rounded-full hover:bg-gray-300"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
