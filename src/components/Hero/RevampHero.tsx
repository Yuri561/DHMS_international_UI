import React from 'react';
import OffsetLink from '../Handler/OffsetLink';
import heroPic from '../../assets/hero.png';
import { motion } from 'framer-motion';

const RevampHero: React.FC = () => {
  return (
<<<<<<< HEAD
    <section className="w-full bg-[#d5a86b]  px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 items-center max-w-8xl mx-auto font-raleway">

      {/* Left Column - Text */}
      <motion.div className="flex flex-col items-center md:items-center justify-center text-center md:text-right px-4 space-y-6">
        <div className="text-nowrap items-center justify-center pl-9 flex flex-col">
          <h1 className="text-8xl sm:text-8xl md:text-6xl lg:text-[100px] ml-32 font-[satisfy] text-white leading-tight">
            Where Culture Meets Beauty
          </h1>
          <p className="text-md sm:text-lg text-white  mt-4">
            Unearth timeless fashion, luminous beauty, and care inspired by heritage.
          </p>
          <OffsetLink
            to="/shop#top"
            className="inline-block mt-6 px-6 py-2 rounded-xl bg-white text-black text-sm sm:text-base font-semibold border border-white hover:scale-105 transition-transform"
          >
=======
    <section className="w-full bg-[#d5a86b] px-4 sm:px-6 py-12 sm:py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 items-center max-w-8xl mx-auto font-raleway">
      
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
>>>>>>> 2085afe29721d2fac0b820fad941fcf175e73781
          Shop Now
        </OffsetLink>
      </div>
    </motion.div>

<<<<<<< HEAD
      {/* Right Column - Hero Image */ }
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    className="flex justify-center items-center mt-12 md:mt-0"
  >
    <img
      src={heroPic}
      alt="hero"
      className="w-64 sm:w-80 md:w-[26rem] object-cover mask-b-from-20% mask-b-to-80%"
    />
  </motion.div>

    </section >
=======
      {/* Right Column - Hero Image */}
      <div className="flex justify-center items-center mt-8 md:mt-0">
        <img 
          src={heroPic} 
          alt="hero"
          className="w-64 sm:w-80 md:w-[30rem] lg:w-[36rem] object-cover mask-b-from-20% mask-b-to-80%"

        />
      </div>

    </section>
>>>>>>> 2085afe29721d2fac0b820fad941fcf175e73781
  );
};

export default RevampHero;