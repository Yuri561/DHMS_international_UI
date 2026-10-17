import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

import bodyOil from '/body.png';
import Bonnet from '/Kente bag.png';
import Clothes from '/banner_dress.jpg';
import Men from '/zigzag-shirt.jpg';
import Jewelry from '/jewelry.webp';
import { useScroll } from '../Context/ScrollProvider';
const categories = [
  {
    title: 'Women Dresses',
    image: Clothes,
    description: 'Elegant, flowy silhouettes that celebrate femininity.',
  },
  {
    title: 'Handbag',
    image: Bonnet,
    description: 'Statement bags that blend culture and craft.',
  },
  {
    title: 'Body Products',
    image: bodyOil,
    description: 'Glow-up essentials made with nourishing ingredients.',
  },
  {
    title: 'Men Shirts',
    image: Men,
    description: 'Confident prints for bold personalities.',
  },
  {
    title: 'Jewelry',
    image: Jewelry,
    description: 'Pieces that tell a story, rooted in tradition.',
  },
];

const BannerRevamp: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const {registerSection} = useScroll();

  useEffect(()=>{
    registerSection(ref)
  },[])
  return (
    <section 
    ref={ref}
    className="bg-[#fdf9f3] text-[#2f2a28] py-24 px-4 md:px-10 font-raleway overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-7xl font-[satisfy] text-[#d5a86b] leading-tight drop-shadow-lg"
        >
          Explore Our Signature Collections
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-base sm:text-lg text-[#7d726a] mt-4 tracking-wide font-light"
        >
          Curated with care. Where culture meets craftsmanship.
        </motion.p>
      </div>

      {/* Swiper Slider */}
      <Swiper
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        loop={true}
        className="max-w-8xl mx-auto"
      >
        {categories.map(({ title, image, description }, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl shadow-lg"
            >
              {/* Full-height image */}
              <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden rounded-3xl">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay with full content */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 active:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-6 text-white">
                  <h2 className="text-2xl sm:text-3xl font-[satisfy] mb-2">{title}</h2>
                  <p className="text-sm sm:text-base font-light max-w-xs">{description}</p>
                  <Link
                    to="/shop"
                    state={{ category: title }}
                    className="mt-4 px-5 py-2 border border-white rounded-full text-sm uppercase tracking-wide hover:bg-white/20 transition"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BannerRevamp;
