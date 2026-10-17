
import { HeroImg } from './HeroImg';
import { motion } from 'framer-motion';
import  OffsetLink  from '@/components/Handler/OffsetLink';

const Hero = () => {
  // Framer Motion variants for text
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  // Framer Motion variants for images
  const imageVariants = (index: number) => ({
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, delay: 0.5 + index * 0.2 },
    },
  });

  return (
    <motion.section
      id="hero"
      className="relative w-full max-w-8xl h-[500px] sm:h-[600px] md:h-[800px] bg-black grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 overflow-hidden"
    >
      {Object.entries(HeroImg).map(([key, img], index) => (
        <motion.div
          key={key}
          className="w-full h-full"
          variants={imageVariants(index)}
          initial="hidden"
          animate="visible"
        >
          <img
            key={key}
            src={img.path}
            alt={`Hero ${key}`}
            className={`w-64 h-full object-cover ${img.theme}`}
          />
        </motion.div>
      ))}

      {/* Overlay text */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-6 sm:space-y-10 text-center px-4"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-raleway leading-tight">
          WHERE CULTURE MEETS <br className="hidden sm:block" /> BEAUTY
        </h1>
        <OffsetLink to="/shop#top" className="text-base mt-8 rounded-xl sm:text-lg px-6 sm:px-8 py-2 bg-white text-black font-raleway cursor-pointer hover:scale-105">
          Shop Now
        </OffsetLink>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
