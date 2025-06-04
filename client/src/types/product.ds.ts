
export type ProductImageProps = {
    id:number;
    front_image: string;
    back_image:string;
    order?:string;
    alt_text?:string;
}
export type ProductProps = {
    id:number;
    name:string;
    price_in_sats: number;
    price_in_fiat:string;
    price?:number;
    images: ProductImageProps[];
    description:string;
}

export type ConsumeProductProps = {
    data: ProductProps[];
}



export type ShopCategoryHeaderProps = {
  selected: string | undefined;
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  categories: { name: string; slug: string }[];
};