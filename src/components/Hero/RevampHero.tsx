import React, { useEffect, useRef } from 'react';
import OffsetLink from '../Handler/OffsetLink';
import heroPic from '../../assets/hero.png';
import { useScroll } from '../Context/ScrollProvider';



const RevampHero: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const {registerSection} = useScroll();
// register the ids on page load or when component first mounts
  useEffect(()=>{
    registerSection(ref)
  }, [])
  return (
    <section 
    ref={ref}

    className="w-full bg-[#d5a86b] px-4 mt-24 sm:px-6 py-12 lg:mt-24 sm:py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 items-center max-w-8xl mx-auto font-raleway">
      
      {/* Left Column - Text */}
      <div className="flex flex-col items-center md:items-center justify-center text-center mt-16 md:text-center space-y-4 sm:space-y-6 px-2 sm:px-4">
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[8rem] font-[satisfy] text-white leading-tight tracking-tight">
          Where Culture Meets Beauty
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-white max-w-md sm:max-w-lg">
          Unearth timeless fashion, luminous beauty, and care inspired by heritage.
        </p>
        <OffsetLink 
          to="/shop#top"
          className="inline-block mt-4 sm:mt-6 px-5 sm:px-6 py-2 rounded-xl bg-white text-black text-sm sm:text-base font-semibold border border-white hover:scale-105 transition-transform"
        >
          Shop Now
        </OffsetLink>
      </div>
   

      {/* Right Column - Hero Image */}
      <div className="flex justify-center items-center mt-8 md:mt-0">
        <img 
          src={heroPic} 
          alt="hero"
          className="w-64 sm:w-80 md:w-[30rem] lg:w-[36rem] object-cover mask-b-from-20% mask-b-to-80%"

        />
      </div>

    </section>
  );
};

export default RevampHero;