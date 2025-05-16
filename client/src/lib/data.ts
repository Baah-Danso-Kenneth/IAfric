import { SubMenusType } from "@/types/regular.dt";

export const navLinks=[
    {name: '2025 trip calender',href:'/calender'},
    {name:'all experience',href:'/contacts'},
    {name:'shop', href:'/shop'},
    {name:'membership',href:'/memebership'},
    {name:'about',href:'/about'}
]

export const littleInfoData=[
    {title:'connect', description:'our trips bring together awesome people around Africa'},
    {title:'experience', description:'our trips bring together awesome people around Africa'},
    {title:'celebrate', description:'our trips bring together awesome people around Africa'},
]

export const whereweGoData=[
    {name:'south africa', image:'/images/cantropae.jpg'},
    {name:'kenya', image:'/images/cantropae.jpg'},
    {name:'nigeria', image:'/images/cantropae.jpg'},
    {name:'ghana', image:'/images/cantropae.jpg'},
    {name:'egypt', image:'/images/cantropae.jpg'},
    {name:'marituius', image:'/images/cantropae.jpg'},
    {name:'morocco', image:'/images/cantropae.jpg'},
    {name:'tanzania', image:'/images/cantropae.jpg'},

]

export const testimonials = [
    {
      name: "Joana Ashley",
      testimony: "Going on a trip with Wild Terrains is like having an in-the-know girlfriend arrange your itinerary."
    },
    {
      name: "Theophilus Issah",
      testimony: "Cannot recommend Wild Terrains—and the Vogue-worthy curation of their trips—enough!"
    },
    {
      name: "Philipa Befi",
      testimony: "They are truly the most perfectly curated trips - and that is coming from a very selective traveler."
    }
  ];


  export const kindwordsData = [
    {
      name: "Benson A.",
      testimony: "Truly transformative experience and I can’t wait to travel with them again! Highly recommended for solo female travelers!"
    },
    {
      name: "Ahinkra B",
      testimony: "Go! I cannot encourage you enough. It is life-changing."
    },
    {
      name: "Michael D.",
      testimony: "Grab your sister, best friend, or mom and sign up for the next travel experience. You’ll leave happy, full, and inspired!"
    },
    {
      name: "Danquah M.",
      testimony: "Wild Terrains is unlike any travel company out there! - and this is coming from a gal who has traveled the world solo!! Lauren and her team made me feel so welcome and “at home”. Truly an amazing experience!"
    },
    {
      name: "Florene A.",
      testimony: "I didn’t know any of the women in the group, but it only took a few minutes to feel that I was among friends. Everyone was fun and interesting, and Wild Terrains created an atmosphere that made us all feel like we belonged. I would recommend this trip to anyone, of any age or background who is looking for a new experience."
    },
    {
      name: "Florene A.",
      testimony: "I didn’t know any of the women in the group, but it only took a few minutes to feel that I was among friends. Everyone was fun and interesting, and Wild Terrains created an atmosphere that made us all feel like we belonged. I would recommend this trip to anyone, of any age or background who is looking for a new experience."
    }
  ];


  export const footerLinks = [
    {
      title: 'about',
      links: [
        { name: 'how it works', href: '/how_works' },
        { name: 'our story', href: '/our_story' },
        { name: 'market place', href: '/market_place' },
        { name: 'content guidelines', href: '/content_guidelines' }
      ]
    },
    {
      title: 'pricing',
      links: [
        { name: 'Pricing', href: '/pricing' },
        { name: 'faq', href: '/faq' },
        { name: 'liscensing terms', href: '/liscense_terms' },
        { name: '(030)-444-6128', href: '#' }
      ]
    },
    {
      title: 'socials',
      links: [
        { name: 'discord', href: '#' },
        { name: 'instagram', href: '#' },
        { name: 'twitter', href: '#' },
        { name: 'Facebook', href: '#' }
      ]
    },
    {
      title:'contacts',
      links: [
        { name: 'discord', href: '#' },
        { name: 'instagram', href: '#' },

      ]

    }
  ];


export const retro=[
  {name:'terms & conditions', path:'#'},
  {name:'privacy policy', path:'#'},
  {name:'dos and dont', path:'#'},
  {name:'accessibility', path:'#'},
  {name:'brand protection', path:'#'},
  {name:'faqs', path:'#'},
  {name:'interest based ', path:'#'},
  {name:'chequers', path:'#'},
  {name:'guidelines', path:'#'},

]


export const ourStyleData=[
  {title:'small groups',
     description:'We really hate shouting across the dinner table, so we cap our group size at 10-12 women per trip. No ifs, ands, or buts about it.',
    image:'/images/user.png'},
    {title:'we accept bitcoin',
      description:'We really hate shouting across the dinner table, so we cap our group size at 10-12 women per trip. No ifs, ands, or buts about it.',
     image:'/images/lightning.png'},
     {title:'flexible bookings',
      description:'We really hate shouting across the dinner table, so we cap our group size at 10-12 women per trip. No ifs, ands, or buts about it.',
     image:'/images/booking.png'}

]

export const sponsorData = [
  {image:'/images/afr.png'},
  {image:'/images/brust.png'},
  {image:'/images/ldk.png'},
  // {image:'/images/simln.svg'},
  {image:'/images/btt.svg'},
  {image:'/images/buy_save.png'},

]

export const subMenus: SubMenusType = {
  'all experience': [
    { name: 'what we do', href: '/experience/what-we-do' },
    { name: 'customer service', href: '/experience/customer-service' },
    { name: 'our routine', href: '/experience/our-routine' },
    { name: 'testimonies', href: '/experience/testimonies' }
  ],
  'about': [
    { name: 'our team', href: '/about/team' },
    { name: 'our history', href: '/about/history' },
    { name: 'our mission', href: '/about/mission' }
  ]
};