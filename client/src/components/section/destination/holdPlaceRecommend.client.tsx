'use client'

import dynamic from "next/dynamic"

const HoldPlaceRecommend=dynamic(()=>import('./holdPlaceRecommend'),{
    ssr:false,
})

export default HoldPlaceRecommend