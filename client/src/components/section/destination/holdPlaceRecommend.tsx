'use client'
import { useRecommendations } from '@/hooks/useRecommendation'
import PeopleTaught from './peopleTaught'


function HoldPlaceRecommend({experienceId}:{experienceId:number}) {
 const {recommendations} = useRecommendations();

 const filteredRecommendations = recommendations.filter(
  (rec)=>rec.experience.id === experienceId
 );
console.log('Count reviews',filteredRecommendations.length)
  return (
         <div className="flex items-center justify-center gap-10 py-10">
           {filteredRecommendations.length > 0 ? (
             filteredRecommendations.map((rec,index)=>(
              <PeopleTaught key={index} name={rec.name} testimony={rec.message}/>
              
             ))
           ) : (
            <div>Loading reviews....
            </div>
            
           )}
    </div>
  )
}

export default HoldPlaceRecommend