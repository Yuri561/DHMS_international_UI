import React from 'react';
import bodyOil from '/body.jpg';
import Bonnet from '/bonnet.jpg';
import Clothes from '/clothingWomen.jpeg';
import Jewelry from '../../assets/jewelry.png'; 
const categories = [
  {
    title: 'Clothing',
    image: Clothes,
  },
  {
    title: 'Hair Care',
    image: Bonnet,
  },
  {
    title: 'Body Care',
    image: bodyOil,
  },
  {
    title: 'Jewelry',
    image: Jewelry,
  },
];

const BannerRevamp: React.FC = () => {
  return (
    <div className="relative bg-[#fdf9f3] text-[#2f2a28] flex flex-col justify-center items-center p-8 font-raleway">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#d5a86b]">Explore Our Categories</h1>
        <p className="text-md text-[#7d726a] mt-2">
          Curated collections inspired by African beauty, wellness, and tradition.
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 max-w-7xl w-full px-4">
        {categories.map(({ title, image }, i) => (
          <div key={i} className="flex flex-col items-center">
            <h2 className="font-[satisfy] text-2xl text-[#2f2a28] mb-4">{title}</h2>
            <div className="relative group w-72 h-[400px] rounded-xl shadow-md overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center px-4">
                <h3 className="text-xl text-[#2f2a28] font-bold drop-shadow mb-2">{title}</h3>
                <button className="mt-2 px-4 py-2 text-sm cursor-pointer text-white border border-white rounded-full hover:bg-white/20 transition">
                  View More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerRevamp;
