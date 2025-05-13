import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";


const bowlby = localFont({
  src: '../../public/fonts/BowlbyOneSC-Regular.ttf',
  variable: '--font-bowlby'
})


const poppins = localFont({
  src: '../../public/fonts/Poppins-Regular.ttf',
  variable: '--font-poppins'
})

const dmMono = localFont({
  src: '../../public/fonts/DMMono-Regular.ttf',
  variable: '--font-dmMono'
})

const outfit = localFont({
  src: '../../public/fonts/Outfit-Regular.ttf',
  variable: '--font-outfit'
})

const play_flaire = localFont({
  src: '../../public/fonts/PlayfairDisplay-Medium.ttf',
  variable: '--font-play_flaire'
})

const polt_waski = localFont({
  src: '../../public/fonts/PoltawskiNowy-MediumItalic.ttf',
  variable: '--font-polt_waski'
})


export const metadata: Metadata = {
  title: "BITOFRIC",
  description: "Lets travel africa together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<body
  className={`${poppins.variable} ${polt_waski.variable} ${outfit.variable} 
  ${bowlby.variable} 
  ${dmMono.variable} 
  ${play_flaire.variable}
  font-outfit antialiased text-softCharcoal  overflow-x-hidden`}
>
  {children}
</body>

    </html>
  );
}
