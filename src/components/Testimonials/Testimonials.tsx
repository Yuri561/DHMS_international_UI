import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface Testimonial {
  name: string;
  role: string;
  image: string;
  testimonial: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Michael Gough',
    role: 'Customer at DHMS International',
    image: '/user1.jpg',
    testimonial:
      'It was a great experience! DHMS International’s products transformed my routine and made me feel confident.',
  },
  {
    name: 'Bonnie Green',
    role: 'Customer at DHMS International',
    image: '/user2.jpg',
    testimonial:
      'DHMS International brings together African heritage and top-quality products. Truly unmatched.',
  },
  {
    name: 'Lana Byrd',
    role: 'Customer at DHMS International',
    image: '/user3.jpg',
    testimonial:
      'I love the bold designs and the cultural pride embedded in everything they sell.',
  },
];

const Testimonials: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <motion.section
      id="testimonials"
      className="w-full bg-[#fdf9f3] text-[#2f2a28] py-16 font-raleway"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#d5a86b]">
          Testimonials
        </h1>
        <div className="border-b-[3px] border-[#a67c52] w-24 mx-auto my-4"></div>
        <p className="text-md sm:text-lg text-[#7d726a] max-w-2xl mx-auto mb-12">
          Hear what our customers have to say about their experiences with DHMS
          International — where culture, confidence, and care come together.
        </p>

        <div className="flex flex-col md:flex-row gap-10 items-start justify-center">
          {/* Left: Selector */}
          <div className="w-full md:w-1/3 space-y-4">
            {testimonials.map((person, index) => (
              <div
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-all border ${
                  selectedIndex === index
                    ? 'bg-[#d5a86b]/20 border-[#d5a86b]'
                    : 'hover:bg-[#d5a86b]/10 border-transparent'
                }`}
              >
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-[#d5a86b]"
                />
                <div className="text-left">
                  <p className="font-semibold text-[#2f2a28]">{person.name}</p>
                  <p className="text-sm text-[#7d726a]">{person.role}</p>
                </div>
              </div>
            ))}

            <button className="text-[#a67c52] mt-6 text-sm hover:underline">
              View other testimonials →
            </button>
          </div>

          {/* Right: Display */}
          <div className="w-full md:w-2/3 bg-white p-8 rounded-3xl shadow-lg text-left">
            <div className="text-6xl text-[#d5a86b] leading-none mb-4">“</div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-[#2f2a28] leading-relaxed">
              {testimonials[selectedIndex].testimonial}
            </h3>
            <p className="text-sm text-[#7d726a]">
              Shared by{' '}
              <span className="font-semibold text-[#2f2a28]">
                {testimonials[selectedIndex].name}
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
