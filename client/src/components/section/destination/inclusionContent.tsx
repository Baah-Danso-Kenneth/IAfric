import { InclusionContentProps } from '@/types/regular';
import Link from 'next/link';
import React from 'react'

function InclusionContent({ title, items, link }: InclusionContentProps) {
    return (
      <div className="space-y-4">
      
        <h2 className="text-xl font-semibold uppercase">{title}</h2>
  
 
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
  
        {link && (
          <Link href={link} className="text-blue-500 underline">
            Learn more
          </Link>
        )}
      </div>
    );
  }
  
  export default InclusionContent;