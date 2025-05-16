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