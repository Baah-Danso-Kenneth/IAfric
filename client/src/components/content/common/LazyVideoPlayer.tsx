"use client"

import React, { useEffect, useRef, useState } from 'react'

interface LazyVideoPlayerProps {
  youtubeID: string;
}

function LazyVideoPlayer({ youtubeID }: LazyVideoPlayerProps) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentContainerRef = containerRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      }, 
      { threshold: 0, rootMargin: "200px" } // Reduced from 1500px for better performance
    );

    if (currentContainerRef) {
      observer.observe(currentContainerRef);
    }

    return () => {
      if (currentContainerRef) {
        observer.unobserve(currentContainerRef);
      }
    }
  }, []); // Added missing dependency array

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {isInView ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeID}?autoplay=1&mute=1&loop=1&playlist=${youtubeID}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
          title="Video player"
        />
      ) : (
        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500">Loading video...</div>
        </div>
      )}
    </div>
  );
}

export default LazyVideoPlayer