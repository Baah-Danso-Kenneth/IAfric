import { useMapContent } from '@/hooks/useMapContent'
import React from 'react'
import BestTimeContent from './bestTimeContent';

function BestTimeHolder({experienceId}:{experienceId:number}) {
  const {mapcontents} = useMapContent();
  console.log("Loaded map contents:", mapcontents)

  const filteredMapContent = Array.isArray(mapcontents)
    ? mapcontents.filter((rec) => rec.experience && rec.experience.id === experienceId)
    : [];

 return (
   <div>
     {filteredMapContent.length > 0 ? (
        filteredMapContent.map((rec,index)=>(
         <BestTimeContent 
          key={index}
          region_map={rec.region_map} 
          best_time_title={rec.best_time_title}
          best_time_des={rec.best_time_des} 
          weather_time_title={rec.weather_time_title}
          weather_time_des={rec.weather_time_des}/>
        ))
     ):(<div>no data</div>)}
   </div>
 )
}


export default BestTimeHolder
