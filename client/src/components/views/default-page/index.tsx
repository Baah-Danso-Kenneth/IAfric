import {Header} from '@/components/layout/Header'
import {HeroSection} from '@/components/views/default-page/HeroSection'
import {LittleInfo} from '@/components/views/default-page/LittleInfo'
import {WhereWeGo} from './WhereWeGo'
import {HelpYouDecide} from './HelpYouDecide'
import PeopleTaught from './PeopleTaught'
import SubScription from '@/components/content/common/SubScription'


export function DefaultPage() {
    return (
      <div>
        <Header/>
        <HeroSection/>
        <LittleInfo/>
        <WhereWeGo/>
        <HelpYouDecide/>
        <PeopleTaught/>
        <SubScription/>
      </div>
    )
  }
  
