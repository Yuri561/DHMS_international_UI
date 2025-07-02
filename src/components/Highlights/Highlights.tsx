import React from 'react';

const Highlights: React.FC = () => {
  return (
    <div
      id="Highlights"
      className="bg-[#fdf9f3] text-[#2f2a28] px-6 py-16 flex flex-col items-center max-w-8xl font-play"
    >
      {/* Hero Heading */}
      <div className="flex flex-col justify-center items-center text-center mb-12 max-w-4xl">
        <h2 className="text-5xl sm:text-8xl font-[raleway] font-bold text-[#d5a86b] text-wrap sm:text-nowrap">
          Africa at Your Fingertips
        </h2>
        <p className="text-base sm:text-lg mt-4 font-medium text-[#7d726a]">
          Rooted in tradition. Elevated for today. Explore handpicked African beauty, wellness, and fashion — crafted to celebrate your glow, your roots, and your rhythm.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {[
          {
            title: '🌿 Authentic African Heritage',
            text: 'From shea butter to kaftan craftsmanship — every product tells a story. We highlight beauty and tradition across the African diaspora.',
          },
          {
            title: '👗 Stylish Afro-Fashion',
            text: 'Shop beautifully tailored kaftans, boubous, and cultural wear — designed for both men and women who love bold elegance and comfort.',
          },
          {
            title: '💸 Fair Prices, Unmatched Value',
            text: 'Beauty and fashion should be accessible. Enjoy luxurious products and statement pieces without the high markups.',
          },
          {
            title: '🚚 Lightning-Fast Delivery',
            text: 'From self-care kits to elegant garments — everything ships quickly and securely to your door, ready to wear or share.',
          },
          {
            title: '🛍️ Curated With Care',
            text: 'Every item in our collection is hand-selected to meet our standard of excellence — blending quality, culture, and confidence.',
          },
          {
            title: '🌎 Afro-Diaspora Powered',
            text: "We're a proud Black-owned brand uplifting African and Caribbean creators, artisans, and tailors through every sale.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300"
          >
            <h3 className="text-xl font-semibold text-[#2f2a28] font-raleway">
              {feature.title}
            </h3>
            <p className="mt-3 text-[#7d726a] text-sm">{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Highlights;
