import LazyVideoPlayer from '@/components/content/common/LazyVideoPlayer';
import clsx from 'clsx'
import Image from 'next/image'

const youtubeID='44I29krtxa'

const MASK_CLASSES =
  "[mask-image:url(/images/video-mask.png)] [mask-mode:alpha] [mask-position:center_center] [mask-repeat:no-repeat] [mask-size:80%_auto]";

export function HeroSection() {
  return (
    <section className='bg-[#c5e7c0] bg-texture'>
        <h2 className='sr-only'>Video reel</h2>
        <div className="relative aspect-video">

        <div
          className={clsx(
            MASK_CLASSES,
            "bg-white absolute  h-[10vh] top-0 lg:top-10"
          )}
        />

<div
  className={clsx(
    MASK_CLASSES,
    "bg-[#8338EC] absolute inset-0 h-full top-2 sm:top-6 md:top-2  xl:top-4"
  )}
/>


        <div
          className={clsx(
            MASK_CLASSES,
            "bg-white absolute inset-0 "
          )}
        />
           <div className={clsx(MASK_CLASSES,"relative h-full ")}>
            <LazyVideoPlayer youtubeID={youtubeID} />
            <Image src="/images/image-texture.png" alt="" fill className="pointer-events-none object-cover opacity-50"/>
           </div>
        </div>
     </section>
  
  )
}
