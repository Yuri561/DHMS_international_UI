import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useScroll } from '../Context/ScrollProvider';

const inStoreItems = [
  {
    name: 'Kaftan Dresses',
    image: '/kaftan.jpg',
    description: 'Hand-stitched elegance in vibrant prints for every body.',
    badge: 'Customer Favorite',
    category: 'Women Dresses',
  },
  {
    name: 'Body Oils',
    image: '/body_oil.png',
    description: 'Scented oils crafted for hydration and glow.',
    badge: 'Best Seller',
    category: 'Body Products',
  },
  {
    name: 'Hair Care',
    image: '/hair_category.jpg',
    description: 'Virgin textures for flawless installs & protective styles.',
    badge: 'Staff Pick',
    category: 'Hair Care',
  },
  {
    name: 'Shea & Black Soap Sets',
    image: '/blacksoap.webp',
    description: 'Gentle, natural cleansing straight from West Africa.',
    badge: 'New Arrival',
    category: 'Body Products',
  },
  {
    name: 'Headwraps & Scarves',
    image: '/headwrap.jpg',
    description: 'Bold prints, breathable fabric — crown your style.',
    badge: 'In-Store Only',
    category: 'Headwraps & Accessories',
  },
  {
    name: 'Men’s Dashiki Tops',
    image: '/dashiki.webp',
    description: 'Cultural pride meets modern tailoring.',
    badge: 'Hot Pick',
    category: 'Men Shirts',
  },
];

const InStore: React.FC = () => {
  const ref = useRef<HTMLElement>(null)
  const {registerSection} = useScroll();
  useEffect(()=>{
    registerSection(ref)
  }, []) 
  return (
    <section
      ref={ref}
      id="InStore"
      className="bg-[#fdf9f3] text-[#2f2a28] px-4 py-20 flex flex-col items-center max-w-8xl font-play overflow-hidden"
    >
      {/* Hero Text */}
      <div className="text-center mb-14 max-w-3xl">
        <h1 className="text-5xl sm:text-7xl font-[satisfy] text-[#d5a86b] leading-tight drop-shadow-lg">
          In Store Pick Up
        </h1>
        <p className="text-base sm:text-lg text-[#7d726a] mt-4">
          Shop online, pick up in person. Some luxurious, high-touch items are exclusively available in-store — because beauty, texture, and quality are best experienced in person.
        </p>
      </div>

      {/* two  Swiper Layout one top one bottom */}
      <div className="space-y-12 w-full">
        {[false, true].map((reverse, i) => (
          <Swiper
            key={i}
            spaceBetween={24}
            slidesPerView={1.3}
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              reverseDirection: reverse,
              pauseOnMouseEnter: true,
            }}
            speed={3500}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            modules={[Autoplay]}
            className="w-full"
          >
            {inStoreItems.map((item, index) => (
              <SwiperSlide key={`${i}-${index}`}>
                <div className="bg-white rounded-3xl shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 text-center p-6 w-full max-w-sm mx-auto relative">
                  {item.badge && (
                    <span className="absolute top-3 right-3 bg-[#a67c52] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      {item.badge}
                    </span>
                  )}
                  <div className="w-full h-[220px] mb-4 rounded-2xl overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-sm text-[#7d726a] mt-1">{item.description}</p>
                  <span className="mt-1 block text-xs font-medium text-[#a67c52]">
                    {item.category}
                  </span>
                  <span className="block text-xs font-medium text-[#a67c52]">
                    Available In-Store Only
                  </span>
                  <Link
                    to="/shop"
                    state={{ category: item.category }}
                    className="mt-4 inline-block px-4 py-2 bg-[#d5a86b] text-[#2f2a28] text-sm font-semibold rounded-full hover:brightness-110 transition"
                  >
                    View Inventory
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-20 text-center max-w-2xl mx-auto">
        <p className="text-md sm:text-lg text-[#7d726a]">
          Feel the fabrics. Smell the scents. Find your fit.
        </p>
        <p className="text-lg text-[#a19990] mt-2">
          Walk-ins welcome • Pickup hours: Mon–Sat, 10am – 6pm
        </p>
        <p className="text-lg text-[#a19990] mt-2">
          Visit us at our Spotsylvania Mall location.
        </p>
      </div>
    </section>
  );
};

export default InStore;
