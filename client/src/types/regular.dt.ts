import { StaticImageData } from "next/dist/shared/lib/get-img-props";
import { JSX, ReactElement } from "react";

export interface CardProps{
  title:string,
  image: StaticImageData,
  description:string,
  buttonClassName?:string,
   imageClassName?:string,
}

export type SocialLink = {
  icons: JSX.Element;
  href: string;
};

export type ActivityProps={
  image1:string; 
  image2:string;
   image3:string;
   path:string;
  title:string;
  btnText:string;
  description:string;
  bgColor:string;
  isReversed:boolean;
  primaryImageIndex: number;
}


export type NavLink = {
  name: string;
  href: string;
  hasSubmenu?: boolean;
};

export type SubMenusType = {
  [key: string]: {
    name: string;
    href: string;
  }[];
};




export interface MenuPopUpProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export interface DropdownItem {
  name: string;
  href: string;
}

export interface CustomDropdownProps {
  title: string;
  items: DropdownItem[];
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right';
  className?: string;
  buttonClassName?: string;
}

export type TeamMemberPros = {

    name:string;
    image:string;
    role:string;
  
}

export type NewDestinationProps={
   image:string;
   description:string;
   price:number;
}

export interface SlideProps{
  heading: string;
  text: string;
  linkText:string;
  linkUrl:string;
}

export type Carousel={
  title:string;
  slides: SlideProps[];
}

export interface TextCarouselProps {
  carousels: Carousel[];
}

export type PageProps = {
  params: {
    slug:string;
  }
}

export type ExperiencePageProps = {
  slug: string;
};
