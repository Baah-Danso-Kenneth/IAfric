
export type IncludedItem = {
  id: number;
  text: string;
};

export type NotIncludedItem = {
  id: number;
  text: string;
};

export type MapContentTypes = {
  id:number;
  region_map:string;
  best_time_title:string;
  best_time_des:string;
  weather_title:string;
  weather_time_des:string;
}

export type TourGuide = {
  id: number;
  name: string;
  slug: string;
  bio: string;
  image: string;
  location?:Location[]
};

export type IncludedItems={
id:number;
text:string;
}

export type UnIncludedItems={
  id:number;
  text:string;
}

export type KindWordProps = {
  id: number;
  name: string;
  words: string;
};

export type Accommodation = {
  id:number;
  name:string;
  description:string;
  location:string;
  image:string
}


export type Location = {
    id: number;
    name: string;
    description: string;
    city: string;
    image:string;
    country: string;
    meal_included:string;
    slug: string;
    latitude: string;
    longitude: string;
    tour_guides?: TourGuide[]
  };
  
  export type Category = {
    id: number;
    name: string;
    slug: string;
    meta_title: string;
    meta_description: string;
    description: string;
    is_featured: boolean;
    order: number;
    image: string | null;
    created_at: string;
    updated_at: string;
  };
  
  export type ExperienceData = {
    id: number;
    name: string;
    slug: string;
    main_image:string;
    description: string;
    duration_days:number;
    duration_nights:number;
    short_description: string;
    place_name: string;
    category: Category;
    map_details:MapContentTypes,
    accommodations: Accommodation[];
    kind_words: KindWordProps[];
    location: Location[];
    included_items: IncludedItem[];
    not_included_items: NotIncludedItem[];
  };
  

  export type LocationHeroSection = {
     data: Pick<ExperienceData,'name'|'main_image' >
  }

  export type BaseDescriptionProps = {
    data: Pick<ExperienceData,
    'name'|'description'|'short_description'|
    'duration_days'|'duration_nights'|'id' | 
    'slug'|'main_image'|'place_name'|'category'
    >
 }


 export type ItinirariesProps = {
    data: Pick<ExperienceData, 'name'|'location' >
 }

 export type AccommodationProps = {
  data: Pick<ExperienceData, 'accommodations' >
}

export type AllKindWords = {
  data: Pick<ExperienceData, 'kind_words' >
}



export type WhatIncludedProps = {
  data: ExperienceData;
}

export type BlendMapTypes = {
  data: Pick<ExperienceData, 'map_details'>
}