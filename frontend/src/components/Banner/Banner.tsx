import { motion } from 'motion/react'
import React from 'react'
import Marquee from 'react-fast-marquee'

const Banner: React.FC = () => {
  return (
    <motion.section
      id='banner' className="w-full h-50 bg-black text-white overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}>
      <Marquee
      className="text-white h-full font-raleway text-7xl overflow-hidden whitespace-nowrap"
        gradient={false}
        speed={100}>
        <a
          href="https://www.google.com/maps/place/137+Spotsylvania+Mall+Dr,+Fredericksburg,+VA+22407"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          DHMS International • Located at 137 Spotsylvania Mall Dr, Fredericksburg, VA, 22407 • DHMS International • Located at 137 Spotsylvania Mall Dr, Fredericksburg, VA, 22407 •
        </a>
      </Marquee>
    </motion.section>
  )
}

export default Banner
