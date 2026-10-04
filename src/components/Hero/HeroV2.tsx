
import React, { useEffect, useRef } from "react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowRight,
  ArrowUpRight,
  MoveDownRight,
  MapPin,
} from "lucide-react";

import OffsetLink from "../Handler/OffsetLink";
import heroPic from "../../assets/hero.png";
import { useScroll } from "../Context/ScrollProvider";

// ============================================================
// DHMS INTERNATIONAL
// EDITORIAL STOREFRONT HERO
// ============================================================

const categories = [
  {
    number: "01",
    name: "Beauty",
    subtitle: "Your everyday ritual",
    description:
      "Nourishing essentials inspired by tradition.",
  },
  {
    number: "02",
    name: "Fashion",
    subtitle: "Wear your heritage",
    description:
      "Expressive pieces for every occasion.",
  },
  {
    number: "03",
    name: "Self-Care",
    subtitle: "A moment for yourself",
    description:
      "Thoughtfully selected everyday indulgences.",
  },
];

// ============================================================
// HERO
// ============================================================

const HeroV2: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { registerSection } = useScroll();

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    registerSection(sectionRef);
  }, [registerSection]);

  const animationDuration = reduceMotion ? 0 : 0.8;

  return (
    <section
      ref={sectionRef}
      id="home"
      className="
        relative
        isolate
        mt-20
        w-full
        min-w-0
        overflow-hidden
        bg-[#F5F0E8]
        font-play
        text-[#291D18]
        sm:mt-24
      "
    >
      {/* ================================================== */}
      {/* MAIN HERO                                          */}
      {/* ================================================== */}

      <div
        className="
          relative
          isolate
          min-w-0
          overflow-hidden
          bg-[#261A16]
          text-[#F8F3EB]
        "
      >
        {/* SUBTLE BACKGROUND TEXTURE */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(90deg,#fff_1px,transparent_1px)]
            [background-size:120px_120px]
          "
        />

        {/* MAIN CONTENT */}

        <div
          className="
            relative
            mx-auto
            grid
            w-full
            min-w-0
            max-w-[1700px]
            lg:min-h-[min(850px,calc(100svh-6rem))]
            lg:grid-cols-[.94fr_1.06fr]
          "
        >
          {/* ================================================== */}
          {/* LEFT — EDITORIAL CONTENT                           */}
          {/* ================================================== */}

          <div
            className="
              relative
              z-20
              flex
              min-w-0
              flex-col
              justify-between
              px-5
              pb-10
              pt-10
              sm:px-8
              sm:pb-14
              sm:pt-14
              lg:px-12
              lg:pb-12
              lg:pt-12
              xl:px-20
              xl:pb-16
              xl:pt-16
              2xl:px-24
            "
          >
            {/* ---------------------------------------------- */}
            {/* TOP BRAND LABEL                                */}
            {/* ---------------------------------------------- */}

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: -15,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: animationDuration,
              }}
              className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    h-8
                    w-[2px]
                    bg-[#C8A47C]
                  "
                />

                <div>
                  <p
                    className="
                      font-raleway
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.25em]
                      text-[#F3E8D8]
                      sm:text-xs
                    "
                  >
                    DHMS International
                  </p>

                  <p
                    className="
                      mt-1
                      font-raleway
                      text-[9px]
                      uppercase
                      tracking-[0.2em]
                      text-[#BC9B7D]
                    "
                  >
                    African-inspired boutique
                  </p>
                </div>
              </div>

              <span
                className="
                  hidden
                  font-raleway
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  text-[#A99585]
                  sm:block
                "
              >
                Virginia, USA
              </span>
            </motion.div>

            {/* ---------------------------------------------- */}
            {/* MAIN HEADING                                  */}
            {/* ---------------------------------------------- */}

            <div
              className="
                relative
                mt-14
                mb-12
                max-w-[760px]
                sm:mt-20
                sm:mb-16
                lg:my-12
              "
            >
              <motion.div
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: -20,
                      }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: animationDuration,
                  delay: 0.12,
                }}
                className="
                  mb-7
                  flex
                  items-center
                  gap-3
                  sm:mb-9
                "
              >
                <span
                  className="
                    h-px
                    w-8
                    bg-[#C8A47C]
                    sm:w-12
                  "
                />

                <span
                  className="
                    font-raleway
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.23em]
                    text-[#C8A47C]
                    sm:text-[10px]
                  "
                >
                  A celebration of identity
                </span>
              </motion.div>

              {/* PRIMARY HEADLINE */}

              <h1
                className="
                  font-raleway
                  text-[clamp(3.15rem,7vw,7.1rem)]
                  font-semibold
                  leading-[0.99]
                  tracking-[-0.075em]
                  text-[#FBF7F0]
                "
              >
                <motion.span
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 35,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: animationDuration,
                    delay: 0.18,
                  }}
                  className="block"
                >
                  Rooted in
                </motion.span>

                <motion.span
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 35,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: animationDuration,
                    delay: 0.32,
                  }}
                  className="block"
                >
                  culture.
                </motion.span>

                <motion.span
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 35,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: animationDuration,
                    delay: 0.46,
                  }}
                  className="
                    mt-2
                    block
                    font-serif
                    text-[1.06em]
                    font-normal
                    italic
                    leading-[1.12]
                    tracking-[-0.065em]
                    text-[#D2B08B]
                  "
                >
                  Made to shine.
                </motion.span>
              </h1>

              {/* INTRODUCTORY COPY */}

              <motion.div
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 20,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: animationDuration,
                  delay: 0.6,
                }}
                className="
                  mt-8
                  max-w-[470px]
                  sm:mt-10
                "
              >
                <p
                  className="
                    text-sm
                    leading-7
                    text-[#D4C7BB]
                    sm:text-base
                    sm:leading-8
                  "
                >
                  Discover African-inspired fashion,
                  beauty, and self-care that celebrate
                  where you come from and the person
                  you're becoming.
                </p>

                <p
                  className="
                    mt-4
                    text-xs
                    leading-6
                    text-[#9F9084]
                    sm:text-sm
                    sm:leading-7
                  "
                >
                  Thoughtfully curated pieces.
                  Beautiful everyday rituals.
                  A little something for every
                  expression of you.
                </p>
              </motion.div>

              {/* ---------------------------------------------- */}
              {/* CALLS TO ACTION                               */}
              {/* ---------------------------------------------- */}

              <motion.div
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 20,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: animationDuration,
                  delay: 0.75,
                }}
                className="
                  mt-9
                  flex
                  flex-col
                  items-stretch
                  gap-4
                  min-[430px]:flex-row
                  min-[430px]:items-center
                  sm:mt-11
                "
              >
                {/* PRIMARY CTA */}

                <OffsetLink
                  to="/shop#top"
                  className="
                    group
                    relative
                    inline-flex
                    min-h-[54px]
                    items-center
                    justify-between
                    gap-5
                    overflow-hidden
                    bg-[#D7B791]
                    px-6
                    py-4
                    font-raleway
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#281A14]
                    transition-colors
                    duration-300
                    hover:bg-[#E7CCAC]
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-4
                    focus-visible:outline-[#D7B791]
                    sm:px-7
                  "
                >
                  <span className="relative z-10">
                    Shop the collection
                  </span>

                  <ArrowUpRight
                    size={18}
                    className="
                      relative
                      z-10
                      shrink-0
                      transition-transform
                      duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />
                </OffsetLink>

                {/* SECONDARY CTA */}

                <OffsetLink
                  to="/about#top"
                  className="
                    group
                    inline-flex
                    min-h-[54px]
                    items-center
                    justify-center
                    gap-3
                    border-b
                    border-[#A98A6B]/50
                    px-1
                    py-3
                    font-raleway
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.1em]
                    text-[#E8D9C9]
                    transition-colors
                    duration-300
                    hover:border-[#D7B791]
                    hover:text-white
                    min-[430px]:px-3
                  "
                >
                  Discover our story

                  <ArrowRight
                    size={16}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </OffsetLink>
              </motion.div>
            </div>

            {/* ---------------------------------------------- */}
            {/* BOTTOM DETAIL                                  */}
            {/* ---------------------------------------------- */}

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 12,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: animationDuration,
                delay: 0.9,
              }}
              className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
                border-t
                border-[#F8F3EB]/15
                pt-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <MapPin
                  size={15}
                  strokeWidth={1.5}
                  className="text-[#C8A47C]"
                />

                <span
                  className="
                    font-raleway
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    text-[#B9A99A]
                  "
                >
                  Virginia-based boutique
                </span>
              </div>

              <a
                href="#Highlights"
                aria-label="Scroll to discover DHMS"
                className="
                  group
                  inline-flex
                  min-h-11
                  items-center
                  gap-2
                  font-raleway
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#C8A47C]
                  transition-colors
                  hover:text-white
                "
              >
                Scroll to discover

                <MoveDownRight
                  size={15}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                    group-hover:translate-y-0.5
                  "
                />
              </a>
            </motion.div>
          </div>

          {/* ================================================== */}
          {/* RIGHT — IMMERSIVE HERO PHOTOGRAPHY                 */}
          {/* ================================================== */}

          <div
            className="
              relative
              isolate
              min-w-0
              overflow-hidden
              bg-[#624A3E]
              lg:min-h-[650px]
            "
          >
            {/* HERO IMAGE */}

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: 1.09,
                    }
              }
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: reduceMotion ? 0 : 1.35,
                ease: "easeOut",
              }}
              className="
                relative
                h-[420px]
                w-full
                overflow-hidden
                min-[480px]:h-[510px]
                sm:h-[620px]
                lg:absolute
                lg:inset-0
                lg:h-full
              "
            >
              <img
                src={heroPic}
                alt="DHMS International African-inspired fashion and beauty collection"
                fetchPriority="high"
                className="
                  h-full
                  w-full
                  object-cover
                  object-center
                "
              />
            </motion.div>

            {/* IMAGE GRADIENTS */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-[#1A100C]/80
                via-transparent
                to-[#1A100C]/10
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                hidden
                bg-gradient-to-r
                from-[#261A16]/30
                via-transparent
                to-transparent
                lg:block
              "
            />

            {/* DESKTOP VERTICAL BRAND MARK */}

            <div
              className="
                absolute
                right-6
                top-10
                hidden
                [writing-mode:vertical-rl]
                lg:block
              "
            >
              <span
                className="
                  font-raleway
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-white/75
                "
              >
                DHMS INTERNATIONAL
              </span>
            </div>

            {/* PHOTO CAPTION */}

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 24,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: animationDuration,
                delay: 0.8,
              }}
              className="
                absolute
                bottom-7
                left-6
                right-6
                z-10
                flex
                items-end
                justify-between
                gap-5
                sm:bottom-10
                sm:left-10
                sm:right-10
                lg:bottom-14
                lg:left-12
                lg:right-12
              "
            >
              <div className="max-w-sm">
                <span
                  className="
                    font-raleway
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-[#E5C6A2]
                  "
                >
                  THE DHMS COLLECTION
                </span>

                <p
                  className="
                    mt-3
                    font-serif
                    text-2xl
                    font-normal
                    italic
                    leading-tight
                    text-[#FFF8F0]
                    sm:text-3xl
                    xl:text-4xl
                  "
                >
                  Beauty in every
                  <br />
                  expression.
                </p>
              </div>

              <span
                aria-hidden="true"
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/60
                  font-serif
                  text-lg
                  italic
                  text-white
                  sm:h-14
                  sm:w-14
                  sm:text-xl
                "
              >
                D
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* COLLECTION NAVIGATION                              */}
      {/* ================================================== */}

      <div
        className="
          relative
          w-full
          min-w-0
          bg-[#F5F0E8]
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1700px]
            px-5
            py-10
            sm:px-8
            sm:py-12
            lg:px-12
            lg:py-14
            xl:px-20
          "
        >
          {/* NAVIGATION HEADER */}

          <div
            className="
              mb-8
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
              sm:mb-10
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  w-7
                  bg-[#A67C52]
                "
              />

              <p
                className="
                  font-raleway
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#97704C]
                "
              >
                Explore DHMS
              </p>
            </div>

            <span
              className="
                font-raleway
                text-[10px]
                font-medium
                uppercase
                tracking-[0.12em]
                text-[#988A7C]
              "
            >
              Curated for you
            </span>
          </div>

          {/* CATEGORY GRID */}

          <div
            className="
              grid
              min-w-0
              grid-cols-1
              border-t
              border-[#D9CFC3]
              sm:grid-cols-3
            "
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.number}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 18,
                      }
                }
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: animationDuration,
                  delay: reduceMotion
                    ? 0
                    : index * 0.1,
                }}
                className={`
                  min-w-0
                  border-b
                  border-[#D9CFC3]
                  sm:border-b-0
                  ${
                    index > 0
                      ? "sm:border-l"
                      : ""
                  }
                `}
              >
                <OffsetLink
                  to="/shop#top"
                  className="
                    group
                    relative
                    flex
                    h-full
                    min-h-[145px]
                    min-w-0
                    flex-col
                    justify-between
                    overflow-hidden
                    px-3
                    py-6
                    transition-colors
                    duration-500
                    hover:bg-[#EAE0D2]
                    sm:min-h-[185px]
                    sm:px-6
                    sm:py-7
                    lg:min-h-[205px]
                    lg:px-9
                  "
                >
                  {/* TOP ROW */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <span
                      className="
                        font-raleway
                        text-[10px]
                        font-semibold
                        tracking-[0.1em]
                        text-[#A99784]
                      "
                    >
                      {category.number}
                    </span>

                    <ArrowUpRight
                      size={19}
                      strokeWidth={1.5}
                      className="
                        text-[#A67C52]
                        transition-transform
                        duration-300
                        group-hover:-translate-y-1
                        group-hover:translate-x-1
                      "
                    />
                  </div>

                  {/* CATEGORY DETAILS */}

                  <div className="mt-7">
                    <h3
                      className="
                        font-serif
                        text-[clamp(2rem,3vw,3.1rem)]
                        font-normal
                        leading-tight
                        tracking-[-0.04em]
                        text-[#332720]
                        transition-colors
                        duration-300
                        group-hover:text-[#9A7048]
                      "
                    >
                      {category.name}
                    </h3>

                    <p
                      className="
                        mt-2
                        font-raleway
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[#9B724B]
                      "
                    >
                      {category.subtitle}
                    </p>

                    <p
                      className="
                        mt-3
                        max-w-[280px]
                        text-xs
                        leading-6
                        text-[#83766A]
                        sm:text-sm
                      "
                    >
                      {category.description}
                    </p>
                  </div>

                  {/* HOVER LINE */}

                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-[2px]
                      w-full
                      origin-left
                      scale-x-0
                      bg-[#A67C52]
                      transition-transform
                      duration-500
                      group-hover:scale-x-100
                    "
                  />
                </OffsetLink>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroV2;