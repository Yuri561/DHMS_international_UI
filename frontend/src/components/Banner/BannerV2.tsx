import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

import 'swiper/css';

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
    description: 'Confident prints created for bold personalities.',
  },
  {
    title: 'Jewelry',
    image: Jewelry,
    description: 'Pieces that tell a story rooted in tradition.',
  },
];

const BannerV2: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { registerSection } = useScroll();

  useEffect(() => {
    registerSection(ref);
  }, [registerSection]);

  return (
    <section
      ref={ref}
      id="collections"
      className="relative overflow-hidden bg-[#F7F1E8] px-4 py-20 text-[#321A14] sm:px-6 sm:py-24 lg:px-10 lg:py-28 xl:px-16"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#E5B974]/15 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#9B4E3B]/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-[90rem]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65 }}
          className="mb-12 flex flex-col gap-7 lg:mb-16 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px w-10 bg-[#9B4E3B]" />

              <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#9B4E3B] sm:text-xs">
                Shop by category
              </p>
            </div>

            <h1 className="font-serif text-4xl font-medium leading-[0.95] tracking-[-0.035em] sm:text-5xl md:text-6xl lg:text-7xl">
              Pieces with a story.
              <span className="mt-2 block italic text-[#B78645]">
                Made to be yours.
              </span>
            </h1>
          </div>

          <p className="max-w-md text-sm leading-7 text-[#594943]/75 sm:text-base">
            Explore collections inspired by African heritage, expressive
            craftsmanship, and the beauty of showing up as yourself.
          </p>
        </motion.div>

        {/* Collection slider */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={18}
          slidesPerView={1.1}
          loop
          speed={750}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            480: {
              slidesPerView: 1.35,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 22,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className="overflow-visible [&_.swiper-wrapper]:items-stretch"
        >
          {categories.map(({ title, image, description }, index) => (
            <SwiperSlide key={title} className="h-auto">
              <motion.article
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(index * 0.08, 0.3),
                }}
                className="group relative h-[30rem] overflow-hidden rounded-[1.75rem] bg-[#321A14] shadow-[0_24px_65px_rgba(50,26,20,0.18)] sm:h-[33rem] lg:h-[36rem]"
              >
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Image treatment */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#21100B]/95 via-[#21100B]/10 to-black/5" />

                <div className="absolute inset-0 border border-white/10 transition-colors duration-300 group-hover:border-[#E5B974]/50" />

                {/* Category number */}
                <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/15 text-xs font-bold text-white backdrop-blur-md">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                  <p className="mb-3 text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#F3D6A5]">
                    DHMS Collection
                  </p>

                  <h2 className="font-serif text-3xl font-medium leading-none sm:text-4xl">
                    {title}
                  </h2>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
                    {description}
                  </p>

                  <Link
                    to="/shop"
                    state={{ category: title }}
                    className="mt-6 inline-flex items-center gap-3 border-b border-[#E5B974] pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#F3D6A5] transition-colors duration-300 hover:text-white"
                  >
                    Explore collection

                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </motion.article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile hint */}
        <p className="mt-7 text-center text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#594943]/45 sm:hidden">
          Swipe to explore
        </p>
      </div>
    </section>
  );
};

export default BannerV2;