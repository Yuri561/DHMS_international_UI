import React from 'react';

const inStoreItems = [
  {
    name: 'Kaftan Dresses',
    image: '/kaftan.jpg',
    description: 'Hand-stitched elegance in vibrant prints for every body.',
    badge: 'Customer Favorite',
  },
  {
    name: 'Body Oils',
    image: '/body_oil.png',
    description: 'Scented oils crafted for hydration and glow.',
    badge: 'Best Seller',
  },
  {
    name: 'Hair Bundles',
    image: '/hair_category.jpg',
    description: 'Virgin textures for flawless installs & protective styles.',
    badge: 'Staff Pick',
  },
  {
    name: 'Shea & Black Soap Sets',
    image: '/blacksoap.webp',
    description: 'Gentle, natural cleansing straight from West Africa.',
    badge: 'New Arrival',
  },
  {
    name: 'Headwraps & Scarves',
    image: '/headwrap.jpg',
    description: 'Bold prints, breathable fabric — crown your style.',
    badge: 'In-Store Only',
  },
  {
    name: 'Men’s Dashiki Tops',
    image: '/dashiki.webp',
    description: 'Cultural pride meets modern tailoring.',
    badge: 'Hot Pick',
  },
];

const InStore: React.FC = () => {
  return (
    <div
      id="InStore"
      className="w-full bg-[#fdf9f3] px-4 sm:px-6 md:px-8 py-20 relative text-[#2f2a28] font-raleway overflow-hidden"
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/textures/african-pattern.png')] bg-cover bg-center"></div>

      {/* Hero Text */}
      <div className="relative z-10 text-center mb-12 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-play font-extrabold text-[#d5a86b] leading-tight">
          In-Store Pickup Available
        </h1>
        <p className="text-base sm:text-lg text-[#7d726a] mt-4">
          Shop online, pick up in person. Some luxurious, high-touch items are exclusively available in-store — because beauty, texture, and quality are best experienced in person.
        </p>
      </div>

      {/* Product Grid */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#2f2a28] mb-8">
          Explore Our In-Store Exclusives
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4">
          {inStoreItems.map((item, index) => (
            <div
              key={index}
              className="bg-white text-[#2f2a28] rounded-3xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center text-center p-6 w-full mx-auto relative"
            >
              {/* Badge */}
              {item.badge && (
                <span className="absolute top-3 right-3 bg-[#a67c52] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  {item.badge}
                </span>
              )}

              {/* Image */}
              <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border-4 border-[#d5a86b] shadow-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <h3 className="text-lg font-bold font-raleway">{item.name}</h3>
              <p className="text-sm text-[#7d726a] mt-1">{item.description}</p>
              <span className="mt-2 inline-block text-xs font-medium text-[#a67c52]">
                Available In-Store Only
              </span>

              {/* CTA Button */}
              <button className="mt-4 px-4 py-2 bg-[#d5a86b] text-[#2f2a28] text-sm font-semibold rounded-full hover:brightness-110 hover:scale-105 transition">
                Reserve for Pickup
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-20 text-center max-w-2xl mx-auto">
        <p className="text-lg sm:text-lg text-[#7d726a]">
          Feel the fabrics. Smell the scents. Find your fit.
        </p>
        <p className="text-lg text-[#a19990] mt-2">
          Walk-ins welcome • Pickup hours: Mon–Sat, 10am – 6pm
        </p>
        <p className="text-lg text-[#a19990] mt-2">
          Visit us at our Spotsylvania Mall location.
        </p>
      </div>
    </div>
  );
};

export default InStore;
