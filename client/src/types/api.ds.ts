export type TourGuide = {
  id: number;
  name: string;
  slug: string;
  bio: string;
  image: string;
  location?:Location[]
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
    accommodations: Accommodation[];
    category: Category;
    location: Location[];
  };
  

  export type LocationHeroSection = {
     data: Pick<ExperienceData,'name'|'main_image' >
  }

  export type BaseDescriptionProps = {
    data: Pick<ExperienceData,'name'|'description'|'short_description'|'duration_days'|'duration_nights'>
 }


 export type ItinirariesProps = {
    data: Pick<ExperienceData, 'name'|'location' >
 }

 export type AccommodationProps = {
  data: Pick<ExperienceData, 'accommodations' >
}