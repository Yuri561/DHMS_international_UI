import React from 'react'
import { motion } from 'framer-motion'
import WhyChooseDHMS from './Accordion'
import { ChevronDown } from 'lucide-react'
import OffsetLink from '../Handler/OffsetLink'
interface CategoryItem {
  name: string
  image: string
  description: string
}

const categories: CategoryItem[] = [
  { name: 'Virgin Hair Bundles', image: '/hair.png', description: 'Luscious virgin hair bundles that bring out your inner queen — perfect for showstopping styles rooted in African beauty traditions.' },
  { name: 'Body Oil', image: '/body_oil.png', description: 'Rich, silky body oils inspired by African skincare secrets — for glowing, sun-kissed skin that turns heads everywhere you go.' },
  { name: 'Supplements', image: '/supplements.png', description: 'Nourish your beauty from within with premium supplements designed to support melanin-rich skin, strong hair, and vibrant energy.' },
  { name: 'Designer Bags', image: '/designer_bag.png', description: 'Bold, statement-making designer bags to elevate your style — carry your culture, confidence, and power on your shoulder.' },
  { name: 'Braiding Hair', image: '/braiding_hair.png', description: 'Vibrant braiding hair for the ultimate protective styles — celebrate African heritage with every twist, braid, and bead.' },
  { name: 'Braiding Hair', image: '/braiding_hair.png', description: 'Vibrant braiding hair for the ultimate protective styles — celebrate African heritage with every twist, braid, and bead.' },
  { name: 'Jewelry', image: '/jewelry.png', description: 'Dazzling jewelry pieces inspired by African royalty — adorn yourself with earrings, rings, and necklaces fit for a goddess.' },
  { name: 'Jewelry', image: '/jewelry.png', description: 'Dazzling jewelry pieces inspired by African royalty — adorn yourself with earrings, rings, and necklaces fit for a goddess.' },
  { name: 'Dress', image: '/dress.jpg', description: 'Fierce and fabulous dresses that make you feel unstoppable — channeling African prints, bold colors, and effortless glam.' },
]

const Category = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const infoSections = [
    { title: 'Our Mission', content: 'To empower individuals to embrace their beauty and culture through high-quality products that celebrate African heritage.' },
    { title: 'Our Vision', content: 'To be the leading destination for beauty products that honor and uplift African culture, inspiring confidence and self-love in every individual.' },
    { title: 'Our Values', content: 'We believe in the power of beauty to transform lives. Our values are rooted in respect for African culture, commitment to quality, and dedication to customer satisfaction.' },
  ]

  return (
    <motion.section
      id='categories'
      className=' w-full bg-black sm:px-6 md:px-8 py-16 relative'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <h2 className='text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f3cb50] mb-12 font-serif tracking-wide'>
        Explore Our Categories
      </h2>

      <div className='grid sm:grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left Column */}
        <div className='flex flex-col space-y-6 md:col-span-1'>
          <div className='flex justify-center'>
            <img
              src='/logo.png'
              alt='Logo'
              className='w-20 h-20 rounded-full border-4 border-yellow-700 shadow-lg'
            />
          </div>

          <div className='bg-yellow-700 text-white rounded-lg p-6 flex flex-col items-center justify-between shadow-md'>
            <p className='text-xl sm:text-2xl leading-relaxed text-center font-semibold font-raleway'>
              EVERYTHING YOU NEED <br /> TO FEEL BEAUTIFUL, EVERY DAY.
            </p>
            <OffsetLink to='/shop#top' className='mt-6 bg-white text-black rounded-full p-4 w-14 h-14 flex items-center justify-center hover:scale-110 transition'>
              →
            </OffsetLink>
          </div>

          <div className='text-white rounded-lg p-6 text-center shadow-md'>
            <span className='text-2xl uppercase font-raleway'>What Makes Us Unique</span>
            <WhyChooseDHMS />
          </div>

          {infoSections.map((section, index) => (
            <div key={index} className='bg-yellow-700 text-white rounded-lg shadow-md'>
              <button
                onClick={() => toggleAccordion(index)}
                className='w-full flex justify-between items-center p-4 text-left'
              >
                <span className='font-extrabold text-lg uppercase font-raleway'>{section.title}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className='px-4 pb-4 text-sm sm:text-base leading-relaxed font-raleway'>
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Category Grid */}
        <div className='md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              className="group relative flex flex-col items-center justify-center rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-84 object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Glass Overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center text-center px-4">
                <h3 className="text-lg sm:text-xl text-black font-bold drop-shadow-md mb-1">{cat.name}</h3>
                <p className="text-lg text-black font-bold drop-shadow-md">{cat.description}</p>
                <button className="mt-3 px-4 py-2 text-sm text-white border border-white rounded-full hover:bg-white/20 cursor-pointer transition">
                  View More
                </button>
              </div>
            </motion.div>
          ))}


        </div>
      </div>
    </motion.section>
  )
}

export default Category
