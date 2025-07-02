import React from 'react';
import bodyOil from '/body.png';
import Bonnet from '/Kente bag.png';
import Clothes from '/purple-kaftan.jpg';
import Men from '/zigzag-shirt.jpg';
import { Link } from 'react-router-dom';

const categories = [
  {
    title: "Women Dresses",
    image: Clothes,
  },
  {
    title: 'Handbang',
    image: Bonnet,
  },
  {
    title: 'Body Products',
    image: bodyOil,
  },
  {
    title: "Men Shirts",
    image: Men,
  },
];

const BannerRevamp: React.FC = () => {
  return (
    <section className="relative bg-[#fdf9f3] text-[#2f2a28] py-20 px-6 font-raleway">
      {/* Heading */}
      <div className="text-center mb-20 max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-7xl text-wrap md:text-nowrap sm:text-nowrap font-[satisfy] text-[#d5a86b] leading-tight drop-shadow-lg">
          Explore Our Signature Collections
        </h1>
        <p className="text-lg text-[#7d726a] mt-4 font-light tracking-wide">
          Curated with care — luxury meets heritage in every piece.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 max-w-7xl mx-auto">
        {categories.map(({ title, image }, i) => (
          <div
            key={i}
            className="flex flex-col items-center group hover:scale-[1.02] transition-transform duration-500"
          >
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[550px] rounded-2xl shadow-xl overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm flex flex-col items-center justify-end p-6">
                <Link
                  to="/shop"
                  state={{ category: title }}
                  className="mt-4 px-6 py-2 text-sm tracking-wide uppercase text-white border border-white rounded-full hover:bg-white/20 transition duration-300"
                >
                  View More
                </Link>
              </div>
            </div>
            <h2 className="mt-6 text-2xl font-semibold font-[satisfy] text-[#2f2a28] tracking-wider">
              {title}
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BannerRevamp;
