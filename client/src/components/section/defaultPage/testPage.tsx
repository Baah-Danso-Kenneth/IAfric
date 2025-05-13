'use client'

import { useExperience } from '@/hooks/useExperience'
import Link from 'next/link'
import React from 'react'

function TestPage() {
  const {experiences, loading, error} = useExperience()

  if (loading) return <p>Loading....</p>
  if(error) return <p>Error loading experiences: {error}</p>
  return (
    <div>
        {experiences.map(({title,description})=>(
          <Link href={`/destination/${encodeURIComponent(title)}`}>
            <p>{title}</p>
          </Link>
        ))}
    </div>
  )
}

export default TestPage