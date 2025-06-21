import React from 'react'
// import Hero from '../Hero/Hero'
// import Categories from '../Categories/Categories'
import Testimonials from '../Testimonials/Testimonials'
// import Banner from '../Banner/Banner'
import Highlights from '../Highlights/Highlights'
import InStore from '../InStore/InStore'
import RevampHero from '../Hero/RevampHero'
import BannerRevamp from '../Banner/BannerRevamp'


const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen pt-36 md:pt-28 lg:pt-24">
      <main className="flex-grow">
        {/* <Hero /> */}
        <RevampHero/>
        {/* <Banner/> */}
        <BannerRevamp/>
        <InStore/>
        {/* <Categories /> */}
        <Highlights/>
        <Testimonials/>

      
     
      </main>
    </div>
  );
}

export default Home;