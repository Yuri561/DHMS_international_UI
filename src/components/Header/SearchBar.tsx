import { motion } from 'framer-motion';
import React from 'react';
import Marquee from 'react-fast-marquee';

const SearchBar: React.FC = () => {
  return (
    <motion.section
      id="banner"
      className="w-full h-8  text-white text-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <Marquee
        className="h-full whitespace-nowrap"
        gradient={false}
        speed={50}
      >
        <a
          href="https://www.google.com/maps/place/137+Spotsylvania+Mall+Dr,+Fredericksburg,+VA+22407"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          📍 DHMS International • 137 Spotsylvania Mall Dr, Fredericksburg, VA 22407 •
        </a>
      </Marquee>
    </motion.section>
  );
};

export default SearchBar;
