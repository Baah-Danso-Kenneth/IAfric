export type Location = {
    id: number;
    name: string;
    description: string;
    city: string;
    country: string;
    slug: string;
    latitude: string;
    longitude: string;
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