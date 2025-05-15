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