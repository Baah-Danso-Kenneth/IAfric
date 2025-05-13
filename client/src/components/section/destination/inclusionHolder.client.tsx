'use client'

import dynamic from "next/dynamic"

export const InclusionHolder = dynamic(()=>import('./inclusionHolder'),{
    ssr: false
})