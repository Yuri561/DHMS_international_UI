import React, {useRef, useEffect} from 'react';
import { motion } from 'framer-motion';
import { useScroll } from '../Context/ScrollProvider';
const features = [
  {
    icon: '🌿',
    title: 'Authentic African Heritage',
    description:
      'From shea butter to kaftan craftsmanship — every product tells a story rooted in Africa. Celebrate the beauty of culture in every item.',
  },
  {
    icon: '👗',
    title: 'Stylish Afro-Fashion',
    description:
      'Shop stunning kaftans, boubous, and signature pieces. Unapologetically bold. Exceptionally comfortable. Designed to stand out.',
  },
  {
    icon: '💸',
    title: 'Fair Prices, Unmatched Value',
    description:
      'High-quality, handcrafted goods without the boutique markup. We believe cultural pride should be affordable.',
  },
  {
    icon: '🚚',
    title: 'Fast & Secure Delivery',
    description:
      'Your style, delivered. We prioritize fast, reliable shipping so you can rock your roots with no delay.',
  },
  {
    icon: '🛍️',
    title: 'Curated With Care',
    description:
      'Everything is handpicked with intention. From textures to tones, each product aligns with our values of quality and identity.',
  },
  {
    icon: '🌍',
    title: 'Afro-Diaspora Powered',
    description:
      'We are proudly Black-owned and committed to uplifting African and Caribbean artisans, designers, and storytellers.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Highlights: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const {registerSection} = useScroll();

  useEffect(()=>{
    registerSection(ref)
  },[])
  return (
    <section
      ref={ref}
      id="Highlights"
      className="bg-[#fdf9f3] text-[#2f2a28] px-6 py-24 flex flex-col items-center max-w-8xl font-play"
    >
      {/* Title */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center mb-20 max-w-4xl"
      >
        <h2 className="text-5xl sm:text-7xl font-[satisfy] text-[#d5a86b] leading-tight drop-shadow-lg">
          Africa at Your Fingertips
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#7d726a]">
          Rooted in tradition. Elevated for today. Explore handpicked African beauty, wellness, and fashion — crafted to celebrate your glow, your roots, and your rhythm.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-2xl p-8 shadow hover:shadow-xl hover:scale-[1.02] transition duration-300 text-center"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-[#2f2a28] font-raleway">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm text-[#7d726a]">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Highlights;
