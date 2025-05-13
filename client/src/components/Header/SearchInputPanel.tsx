import React from 'react'
import RecentSearch from '../content/recentSearch'
import TrendingSearch from '../content/trendingSearch'
import TrendingTopics from '../content/trendingTopics'

function SearchInputPanel() {
  return (
    <div className=' w-[950px] bg-white border text-black border-black p-10 rounded-2xl'>
       <RecentSearch/>
       <TrendingSearch/>
       <TrendingTopics/>
    </div>
  )
}

export default SearchInputPanel