import React from 'react'
// import Hero from '../Hero/Hero'
// import Categories from '../Categories/Categories'
import Testimonials from '../Testimonials/TestimonialsV2'
// import Banner from '../Banner/Banner'
import Highlights from '../Highlights/HighlightsV2'
import InStore from '../InStore/InStoreV2'
import RevampHero from '../Hero/RevampHero'
import BannerRevamp from '../Banner/BannerRevamp'
import HeroV2 from '../Hero/HeroV2';
import BannerV2 from '../Banner/BannerV2';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen  ">
      <main className="flex-grow">
        {/* <Hero /> */}
          <HeroV2/>
        {/* <Banner/> */}
        <BannerV2/>
        <InStore/>
        {/* <Categories /> */}
        <Highlights/>
        <Testimonials/>
      </main>
    </div>
  );
}

export default Home;