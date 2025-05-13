import { footerLinks } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'

function Footer() {
  return (
    <div className='bg-black pt-5 '>
    <div className=' mx-10  text-white'>
        <div className='flex flex-col md:flex-row gap-32 lg:gap-52 lg:pb-20 pb-10'>

            <div className='space-y-5 md:max-w-[30%] lg:max-w-[20%]'>
            <div>
                {/* <Image src='/images/tc-turner.svg' alt="app-image" width={250} height={250}/> */}
            </div>

            <p>We are here to give you an unforgottable experience in Ghana.</p>
            <div className='flex items-center relative gap-6'>
                          <Image src="/images/x.svg" width={30} height={50} alt="icon"/>
                          <Image src="/images/fb.svg" width={30} height={50} alt="icon"/>
                          <Image src="/images/ig.svg" className="absolute -top-1 left-24"width={60} height={50} alt="icon"/>
                     </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-36 lg:gap-64'>
                 {footerLinks.map((section,index)=>(
                <div key={index}>
                   <h1 className='font-extrabold text-[16px] md:text-[20px] capitalize mb-1'>{section.title}</h1> 
                    <ul key={index}>
                        {section.links.map((link, linkIndex)=>(
                        <div key={linkIndex} className='flex-col py-2 capitalize  '>
                            <Link href={link.href}>
                               <span className="text-nowrap">{link.name}</span> 
                            </Link>
                            </div>

                        ))}
                    </ul>
                </div>
            
            ))}
                </div>

        </div>

        <div className='border  md:pt-3  text-[13px] md:text-[15px] font-bold border-t border-l-0  border-r-0 border-b-0 border-brand-rcc flex flex-col md:flex-row justify-between'>
        
          <div>
            <h1> &copy;2025 Explore GH, Allrights reserved</h1>
          </div>

          <div className='flex flex-col lg:flex-row gap-10 md:gap-20 mb-5'>
            <div>
            <Link href="#">Privacy&Policy</Link>
            </div>

            <div>
            <Link href="#">Terms&Condition</Link>
            </div>
          </div>

      </div>

    </div>
    </div>
  )
}


export default Footer