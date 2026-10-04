
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Globe2,
  Truck,
  HeartHandshake,
  ShieldCheck,
  Shirt,
} from "lucide-react";

import { useScroll } from "../Context/ScrollProvider";

// ---------------------------------------------------------
// FEATURES
// ---------------------------------------------------------

const features = [
  {
    number: "01",
    icon: Globe2,
    title: "Authentic African Heritage",
    description:
      "Discover products rooted in African tradition. From natural shea butter to beautifully crafted fashion, every piece celebrates culture, identity, and heritage.",
    tag: "OUR ROOTS",
  },
  {
    number: "02",
    icon: Shirt,
    title: "Stylish Afro-Fashion",
    description:
      "Express yourself through beautifully designed kaftans, boubous, and statement pieces that bring traditional craftsmanship into modern fashion.",
    tag: "OUR STYLE",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Fair Prices, Real Value",
    description:
      "Enjoy carefully selected, quality products at accessible prices. We believe celebrating your culture should never mean compromising on value.",
    tag: "OUR PROMISE",
  },
  {
    number: "04",
    icon: Truck,
    title: "Reliable Delivery",
    description:
      "From our collection to your doorstep, we make shopping convenient with dependable shipping and a smooth ordering experience.",
    tag: "OUR SERVICE",
  },
  {
    number: "05",
    icon: Sparkles,
    title: "Curated With Care",
    description:
      "Every item is selected with intention, bringing together beautiful textures, thoughtful craftsmanship, and products that reflect our values.",
    tag: "OUR COLLECTION",
  },
  {
    number: "06",
    icon: HeartHandshake,
    title: "Afro-Diaspora Powered",
    description:
      "Proudly Black-owned and inspired by the African diaspora, we celebrate the creativity, traditions, and craftsmanship of African and Caribbean communities.",
    tag: "OUR COMMUNITY",
  },
];

// ---------------------------------------------------------
// ANIMATIONS
// ---------------------------------------------------------

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

// ---------------------------------------------------------
// HIGHLIGHTS COMPONENT
// ---------------------------------------------------------

const Highlights: React.FC = () => {
  const ref = useRef<HTMLElement>(null);

  const { registerSection } = useScroll();

  useEffect(() => {
    registerSection(ref);
  }, [registerSection]);

  return (
    <section
      ref={ref}
      id="Highlights"
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-[#FAF7F2]
        px-4
        py-16
        text-[#29231F]
        sm:px-6
        sm:py-20
        lg:px-10
        lg:py-28
        xl:px-16
      "
    >
      {/* BACKGROUND DECORATIONS */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-[350px]
          w-[350px]
          rounded-full
          bg-[#D5A86B]/10
          blur-[100px]
          sm:h-[500px]
          sm:w-[500px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-32
          h-[350px]
          w-[350px]
          rounded-full
          bg-[#B88A50]/10
          blur-[100px]
        "
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">

        {/* --------------------------------------------- */}
        {/* SECTION HEADER */}
        {/* --------------------------------------------- */}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="
            mx-auto
            mb-12
            flex
            max-w-3xl
            flex-col
            items-center
            text-center
            sm:mb-16
            lg:mb-20
          "
        >
          {/* EYEBROW */}

          <div
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#D5A86B]/30
              bg-[#D5A86B]/10
              px-4
              py-2
            "
          >
            <Sparkles
              size={14}
              className="text-[#B88A50]"
            />

            <span
              className="
                font-raleway
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#9B713D]
                sm:text-xs
              "
            >
              The DHMS Experience
            </span>
          </div>

          {/* HEADING */}

          <h2
            className="
              font-[satisfy]
              text-[clamp(2.5rem,7vw,5rem)]
              leading-[1.15]
              text-[#B88A50]
            "
          >
            Africa at Your Fingertips
          </h2>

          {/* DECORATIVE DIVIDER */}

          <div
            className="
              my-6
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <span className="h-px w-10 bg-[#D5A86B]/60 sm:w-16" />

            <span className="h-1.5 w-1.5 rotate-45 bg-[#B88A50]" />

            <span className="h-px w-10 bg-[#D5A86B]/60 sm:w-16" />
          </div>

          {/* DESCRIPTION */}

          <p
            className="
              max-w-2xl
              font-play
              text-sm
              leading-7
              text-[#786D63]
              sm:text-base
              sm:leading-8
              lg:text-lg
            "
          >
            Rooted in tradition. Elevated for today.
            Discover a thoughtfully curated collection
            of African beauty, wellness, and fashion,
            created to celebrate your glow, your roots,
            and your rhythm.
          </p>
        </motion.div>

        {/* --------------------------------------------- */}
        {/* FEATURE CARDS */}
        {/* --------------------------------------------- */}

        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-4
            sm:grid-cols-2
            sm:gap-5
            lg:grid-cols-3
            lg:gap-6
          "
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.number}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.08, 0.4),
                }}
                whileHover={{
                  y: -5,
                }}
                className="
                  group
                  relative
                  flex
                  h-full
                  min-w-0
                  flex-col
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-[#E9E0D4]
                  bg-white
                  p-6
                  shadow-[0_8px_35px_rgba(75,52,30,0.035)]
                  transition-all
                  duration-300
                  hover:border-[#D5A86B]/60
                  hover:shadow-[0_18px_50px_rgba(75,52,30,0.09)]
                  sm:p-7
                  lg:min-h-[310px]
                  lg:p-8
                "
              >
                {/* HOVER ACCENT */}

                <div
                  className="
                    absolute
                    inset-x-0
                    top-0
                    h-[3px]
                    origin-left
                    scale-x-0
                    bg-gradient-to-r
                    from-[#B88A50]
                    via-[#D5A86B]
                    to-[#E7C99C]
                    transition-transform
                    duration-500
                    group-hover:scale-x-100
                  "
                />

                {/* CARD TOP */}

                <div
                  className="
                    mb-7
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >
                  {/* ICON */}

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-[#EAD9BE]
                      bg-[#FAF4EA]
                      text-[#B88A50]
                      transition-all
                      duration-300
                      group-hover:border-[#B88A50]
                      group-hover:bg-[#B88A50]
                      group-hover:text-white
                    "
                  >
                    <Icon
                      size={25}
                      strokeWidth={1.6}
                    />
                  </div>

                  {/* NUMBER */}

                  <span
                    className="
                      font-raleway
                      text-xs
                      font-semibold
                      tracking-widest
                      text-[#D3C5B4]
                    "
                  >
                    {feature.number}
                  </span>
                </div>

                {/* CONTENT */}

                <div className="flex flex-1 flex-col">

                  <h3
                    className="
                      font-raleway
                      text-lg
                      font-bold
                      leading-snug
                      text-[#29231F]
                      sm:text-xl
                    "
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      flex-1
                      font-play
                      text-sm
                      leading-7
                      text-[#786D63]
                    "
                  >
                    {feature.description}
                  </p>

                  {/* BOTTOM */}

                  <div
                    className="
                      mt-7
                      flex
                      items-center
                      justify-between
                      gap-3
                      border-t
                      border-[#F0EAE2]
                      pt-5
                    "
                  >
                    <span
                      className="
                        font-raleway
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-[#B88A50]
                      "
                    >
                      {feature.tag}
                    </span>

                    <ArrowUpRight
                      size={18}
                      className="
                        text-[#C9B8A1]
                        transition-all
                        duration-300
                        group-hover:-translate-y-0.5
                        group-hover:translate-x-0.5
                        group-hover:text-[#B88A50]
                      "
                    />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* --------------------------------------------- */}
        {/* BOTTOM MESSAGE */}
        {/* --------------------------------------------- */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
          className="
            mt-12
            flex
            flex-col
            items-center
            justify-center
            gap-2
            text-center
            sm:mt-16
            sm:flex-row
            sm:gap-3
          "
        >
          <span className="h-px w-8 bg-[#D5A86B] sm:w-10" />

          <p
            className="
              font-play
              text-xs
              italic
              tracking-wide
              text-[#9B8A78]
              sm:text-sm
            "
          >
            More than a collection. A celebration of culture.
          </p>

          <span className="h-px w-8 bg-[#D5A86B] sm:w-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default Highlights;