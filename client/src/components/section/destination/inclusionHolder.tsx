
import { whatsIncluded, whatsNotIncluded } from '@/lib/data'
import React, { useEffect } from 'react'
import InclusionContent from './inclusionContent'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getUnExcludedItems } from '@/redux/features/slices/exclusionSlice'
import { getIncludedContent } from '@/redux/features/slices/inclusionSlice'

function InclusionHolder({experienceId}:{experienceId:number}) {
  const dispatch = useDispatch<AppDispatch>()
  const {includedItems} = useSelector((state:RootState)=>state.includedItems)
  const {excludedItems} = useSelector((state:RootState)=>state.excludedItems)
  
  useEffect(()=>{
    dispatch(getUnExcludedItems())
    dispatch(getIncludedContent())

  },[dispatch])

  useEffect(() => {
    if (includedItems.length === 0) {
      dispatch(getIncludedContent())
    }
  
    if (excludedItems.length === 0) {
      dispatch(getUnExcludedItems())
    }
  }, [dispatch, includedItems.length, excludedItems.length])

  
 

  const filteredItems = includedItems.filter(item=>item.experience.id === experienceId)
  const texts = filteredItems.map(item=>item.text);

  const filteredUnItems = excludedItems.filter(item=>item.experience.id === experienceId)
  const untexts = filteredUnItems.map(item=>item.text);

  return (
    <div className='grid grid-cols-2 mx-auto max-w-5xl'>
        <InclusionContent title="What's Included" items={texts} />
        <InclusionContent title="What's Not Included" items={untexts} />
    </div>
  )
}

export default InclusionHolder