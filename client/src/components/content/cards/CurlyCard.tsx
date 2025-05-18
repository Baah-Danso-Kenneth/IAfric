"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { HorizontalLine, VerticalLine } from '../common/Lines';
import { Scribble } from '../common/Scribble';
import { TeamMemberPros } from '@/types/regular.dt';

async function getDominantColor(relativeUrl: string) {
  try {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const palleteURL = new URL(`${baseUrl}${relativeUrl}`);
    palleteURL.searchParams.set("palette", "json");
  
    const res = await fetch(palleteURL.toString());
    const json = await res.json();
  
    return (
      json.dominant_colors?.vibrant?.hex || json.dominant_colors?.vibrant_light?.hex
    );
  } catch (error) {
    console.error("Error fetching dominant color:", error);
    return undefined;
  }
}

const VERTICAL_LINE_CLASSES =
  "absolute top-0 h-full stroke-2 text-stone-300 transition-colors group-hover:text-stone-400";

const HORIZONTAL_LINE_CLASSES =
  "-mx-8 stroke-2 text-stone-300 transition-colors group-hover:text-stone-400";

function CurlyCard({ name, image, role }: TeamMemberPros) {
  const [dominantColor, setDominantColor] = useState<string>('#ccc');

  useEffect(() => {
    const fetchColor = async () => {
      const color = await getDominantColor(image); 
      if (color) {
        setDominantColor(color);
      }
    };

    fetchColor();
  }, [image]);

  return (
    <div className="relative group mx-auto w-full max-w-72 px-8 pt-2">
      <VerticalLine className={clsx(VERTICAL_LINE_CLASSES, "left-4")} />
      <VerticalLine className={clsx(VERTICAL_LINE_CLASSES, "right-4")} />
      <HorizontalLine className={HORIZONTAL_LINE_CLASSES} />

      {/* Image */}
      <div className="py-4 overflow-hidden flex justify-center">
        <Scribble className="absolute inset-0 w-full h-full" color={dominantColor} />
        <Image
          className="mx-auto w-[80%] origin-top transform-gpu
            transition-transform duration-500
            ease-in-out group-hover:scale-150"
          src={image}
          alt={name}
          width={350}
          height={350}
        />
      </div>
      <HorizontalLine className={HORIZONTAL_LINE_CLASSES} />

      <div className="my-2 text-center font-sans space-y-3 uppercase leading-tight text-[#c5e7c0]">
        <h3 className="font-semibold">{name}</h3>
        <h3 className="text-sm">{role}</h3>
      </div>
    </div>
  );
}

export default CurlyCard;