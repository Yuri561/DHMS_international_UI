
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Quote,
} from "lucide-react";

import { useScroll } from "../Context/ScrollProvider";

// ============================================================
// DHMS INTERNATIONAL
// CUSTOMER STORIES / TESTIMONIALS
// ============================================================

interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  testimonial: string;
}

const testimonials: Testimonial[] = [
  {
    id: "01",
    name: "Michael Gough",
    role: "Customer at DHMS International",
    image: "/user1.jpg",
    testimonial:
      "It was a great experience! DHMS International’s products transformed my routine and made me feel confident.",
  },
  {
    id: "02",
    name: "Bonnie Green",
    role: "Customer at DHMS International",
    image: "/user2.jpg",
    testimonial:
      "DHMS International brings together African heritage and top-quality products. Truly unmatched.",
  },
  {
    id: "03",
    name: "Lana Byrd",
    role: "Customer at DHMS International",
    image: "/user3.jpg",
    testimonial:
      "I love the bold designs and the cultural pride embedded in everything they sell.",
  },
];

// ============================================================
// COMPONENT
// ============================================================

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { registerSection } = useScroll();

  const reduceMotion = useReducedMotion();

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const active = testimonials[selectedIndex];

  const total = testimonials.length;

  // ----------------------------------------------------------
  // REGISTER SECTION
  // ----------------------------------------------------------

  useEffect(() => {
    registerSection(sectionRef);
  }, [registerSection]);

  // ----------------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------------

  const next = () => {
    setSelectedIndex(
      (current) => (current + 1) % total
    );
  };

  const previous = () => {
    setSelectedIndex(
      (current) => (current - 1 + total) % total
    );
  };

  const select = (index: number) => {
    setSelectedIndex(index);
  };

  // ----------------------------------------------------------
  // ANIMATION SETTINGS
  // ----------------------------------------------------------

  const transitionDuration = reduceMotion ? 0 : 0.45;

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="
        relative
        isolate
        w-full
        min-w-0
        overflow-hidden
        bg-[#F8F5EF]
        py-20
        text-[#29211C]
        sm:py-24
        lg:py-32
      "
    >
      {/* ================================================== */}
      {/* BACKGROUND DETAILS                                 */}
      {/* ================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-24
          top-0
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#D8C5AA]/15
          blur-[100px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-32
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#C4A27E]/10
          blur-[100px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1500px]
          px-4
          sm:px-6
          lg:px-12
          xl:px-16
        "
      >
        {/* ================================================== */}
        {/* SECTION INTRO                                     */}
        {/* ================================================== */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 25,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            mb-12
            flex
            flex-col
            gap-7
            sm:mb-16
            lg:mb-20
            lg:flex-row
            lg:items-end
            lg:justify-between
            lg:gap-16
          "
        >
          {/* LEFT HEADER */}

          <div className="max-w-[850px]">
            <div
              className="
                mb-7
                flex
                items-center
                gap-4
              "
            >
              <span
                className="
                  h-px
                  w-9
                  bg-[#A67C52]
                "
              />

              <span
                className="
                  font-raleway
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.23em]
                  text-[#9A7048]
                  sm:text-xs
                "
              >
                The DHMS Experience
              </span>
            </div>

            <h2
              className="
                font-raleway
                text-[clamp(2.8rem,6vw,6rem)]
                font-semibold
                leading-[1.04]
                tracking-[-0.065em]
                text-[#29211C]
              "
            >
              More than
              <br />
              a purchase.

              <span
                className="
                  mt-1
                  block
                  font-serif
                  font-normal
                  italic
                  text-[#A67C52]
                "
              >
                A connection.
              </span>
            </h2>
          </div>

          {/* RIGHT DESCRIPTION */}

          <div
            className="
              max-w-[370px]
              lg:pb-3
            "
          >
            <p
              className="
                mb-4
                font-raleway
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#A67C52]
              "
            >
              Words from our community
            </p>

            <p
              className="
                font-play
                text-sm
                leading-8
                text-[#786D63]
                sm:text-base
              "
            >
              Behind every beautiful find is
              someone who makes it their own.

              Discover what our customers
              have to say about their
              experiences with DHMS International.
            </p>
          </div>
        </motion.div>

        {/* ================================================== */}
        {/* MAIN TESTIMONIAL SHOWCASE                         */}
        {/* ================================================== */}

        <div
          className="
            grid
            min-w-0
            overflow-hidden
            bg-[#EDE5DA]
            lg:grid-cols-[0.35fr_0.65fr]
          "
        >
          {/* ================================================== */}
          {/* CUSTOMER SELECTOR                                  */}
          {/* ================================================== */}

          <div
            className="
              order-2
              flex
              min-w-0
              flex-col
              border-t
              border-[#D7C9B7]
              px-5
              py-7
              sm:px-8
              sm:py-9
              lg:order-1
              lg:border-r
              lg:border-t-0
              lg:px-9
              lg:py-12
              xl:px-12
            "
          >
            {/* SELECTOR TOP */}

            <div
              className="
                mb-7
                flex
                items-center
                justify-between
                gap-4
                lg:mb-10
              "
            >
              <span
                className="
                  font-raleway
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#9B724B]
                "
              >
                Our Community
              </span>

              <span
                className="
                  font-raleway
                  text-[10px]
                  font-semibold
                  tracking-[0.1em]
                  text-[#9D8B76]
                "
              >
                0{selectedIndex + 1} / 0{total}
              </span>
            </div>

            {/* SELECTOR HEADING */}

            <h3
              className="
                mb-7
                font-serif
                text-2xl
                font-normal
                italic
                text-[#49392B]
                sm:text-3xl
                lg:mb-9
              "
            >
              Voices of DHMS.
            </h3>

            {/* CUSTOMER SELECTOR */}

            <div
              className="
                flex
                min-w-0
                flex-col
                gap-2
                sm:gap-3
              "
            >
              {testimonials.map((person, index) => {
                const isActive =
                  selectedIndex === index;

                return (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => select(index)}
                    aria-pressed={isActive}
                    aria-label={`Read ${person.name}'s testimonial`}
                    className={`
                      group
                      relative
                      flex
                      min-h-[76px]
                      w-full
                      min-w-0
                      items-center
                      gap-3
                      border
                      px-3
                      py-3
                      text-left
                      outline-none
                      transition-all
                      duration-300
                      sm:gap-4
                      sm:px-4
                      lg:min-h-[88px]
                      ${
                        isActive
                          ? "border-[#C3A27E] bg-[#F8F5EF]"
                          : "border-transparent hover:border-[#D7C9B7] hover:bg-[#F8F5EF]/50"
                      }
                      focus-visible:border-[#A67C52]
                    `}
                  >
                    {/* ACTIVE SIDE INDICATOR */}

                    {isActive && (
                      <motion.span
                        layoutId="dhms-testimonial-indicator"
                        transition={{
                          duration: 0.3,
                        }}
                        className="
                          absolute
                          bottom-0
                          left-0
                          top-0
                          w-[3px]
                          bg-[#A67C52]
                        "
                      />
                    )}

                    {/* CUSTOMER IMAGE */}

                    <div
                      className="
                        relative
                        h-12
                        w-12
                        shrink-0
                        overflow-hidden
                        rounded-full
                        bg-[#D8C5AA]
                        sm:h-14
                        sm:w-14
                      "
                    >
                      <img
                        src={person.image}
                        alt={person.name}
                        loading="lazy"
                        decoding="async"
                        className={`
                          h-full
                          w-full
                          object-cover
                          transition-all
                          duration-500
                          ${
                            isActive
                              ? "scale-105"
                              : "grayscale-[40%] group-hover:grayscale-0"
                          }
                        `}
                      />
                    </div>

                    {/* CUSTOMER DETAILS */}

                    <div className="min-w-0 flex-1">
                      <p
                        className={`
                          truncate
                          font-raleway
                          text-sm
                          font-semibold
                          transition-colors
                          sm:text-base
                          ${
                            isActive
                              ? "text-[#29211C]"
                              : "text-[#62574C]"
                          }
                        `}
                      >
                        {person.name}
                      </p>

                      <p
                        className="
                          mt-1
                          font-play
                          text-[11px]
                          leading-5
                          text-[#978676]
                          sm:text-xs
                        "
                      >
                        {person.role}
                      </p>
                    </div>

                    {/* ACTIVE ARROW */}

                    <ArrowUpRight
                      size={17}
                      className={`
                        shrink-0
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "text-[#A67C52]"
                            : "text-[#B5A491] opacity-50 group-hover:opacity-100"
                        }
                      `}
                    />
                  </button>
                );
              })}
            </div>

            {/* SELECTOR BOTTOM */}

            <div
              className="
                mt-9
                border-t
                border-[#D7C9B7]
                pt-6
                lg:mt-auto
                lg:pt-8
              "
            >
              <p
                className="
                  font-play
                  text-xs
                  italic
                  leading-6
                  text-[#978676]
                "
              >
                Every story is part of
                what makes our community special.
              </p>

              <Link
                to="/shop"
                className="
                  group
                  mt-5
                  inline-flex
                  min-h-11
                  items-center
                  gap-2
                  font-raleway
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#8D623B]
                  transition-all
                  duration-300
                  hover:gap-3
                  hover:text-[#29211C]
                "
              >
                Explore our collection

                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* ================================================== */}
          {/* FEATURED TESTIMONIAL                               */}
          {/* ================================================== */}

          <div
            className="
              relative
              order-1
              flex
              min-w-0
              flex-col
              justify-between
              overflow-hidden
              bg-[#29211C]
              px-6
              py-10
              text-[#F8F4EC]
              sm:px-10
              sm:py-12
              lg:order-2
              lg:min-h-[590px]
              lg:px-12
              lg:py-14
              xl:min-h-[640px]
              xl:px-16
              xl:py-16
            "
          >
            {/* DECORATIVE BACKGROUND */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-12
                -top-24
                select-none
                font-serif
                text-[300px]
                leading-none
                text-[#FFFFFF]/[0.025]
                sm:text-[430px]
              "
            >
              “
            </div>

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -bottom-40
                -left-32
                h-[320px]
                w-[320px]
                rounded-full
                bg-[#A67C52]/10
                blur-[100px]
              "
            />

            {/* TOP BAR */}

            <div
              className="
                relative
                z-10
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <span
                className="
                  font-raleway
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#C4A27E]
                "
              >
                The Customer Edit
              </span>

              <Quote
                size={25}
                strokeWidth={1.2}
                className="text-[#C4A27E]"
              />
            </div>

            {/* ANIMATED CONTENT */}

            <div
              className="
                relative
                z-10
                flex
                flex-1
                flex-col
                justify-center
                py-12
                sm:py-16
                lg:py-14
              "
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 18,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={
                    reduceMotion
                      ? { opacity: 1 }
                      : {
                          opacity: 0,
                          y: -12,
                        }
                  }
                  transition={{
                    duration: transitionDuration,
                    ease: "easeOut",
                  }}
                >
                  {/* EYEBROW */}

                  <div
                    className="
                      mb-8
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <span
                      className="
                        h-px
                        w-8
                        bg-[#C4A27E]
                      "
                    />

                    <span
                      className="
                        font-raleway
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.17em]
                        text-[#C4A27E]
                      "
                    >
                      In their own words
                    </span>
                  </div>

                  {/* LARGE QUOTE */}

                  <blockquote
                    className="
                      m-0
                      max-w-[780px]
                      font-serif
                      text-[clamp(1.9rem,3.3vw,3.65rem)]
                      font-normal
                      leading-[1.3]
                      tracking-[-0.025em]
                      text-[#F8F4EC]
                    "
                  >
                    <span
                      aria-hidden="true"
                      className="text-[#C4A27E]"
                    >
                      “
                    </span>

                    {active.testimonial}

                    <span
                      aria-hidden="true"
                      className="text-[#C4A27E]"
                    >
                      ”
                    </span>
                  </blockquote>

                  {/* CUSTOMER ATTRIBUTION */}

                  <div
                    className="
                      mt-10
                      flex
                      items-center
                      gap-4
                      sm:mt-12
                    "
                  >
                    <div
                      className="
                        h-px
                        w-10
                        bg-[#C4A27E]
                      "
                    />

                    <div>
                      <p
                        className="
                          font-raleway
                          text-sm
                          font-semibold
                          text-[#F8F4EC]
                          sm:text-base
                        "
                      >
                        {active.name}
                      </p>

                      <p
                        className="
                          mt-1
                          font-play
                          text-xs
                          text-[#B3A69A]
                        "
                      >
                        {active.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* BOTTOM NAVIGATION */}

            <div
              className="
                relative
                z-10
                flex
                items-center
                justify-between
                gap-5
                border-t
                border-white/15
                pt-6
              "
            >
              {/* SLIDE COUNT */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    font-raleway
                    text-sm
                    font-semibold
                    text-[#F8F4EC]
                  "
                >
                  0{selectedIndex + 1}
                </span>

                <span
                  className="
                    h-px
                    w-8
                    bg-white/25
                    sm:w-14
                  "
                />

                <span
                  className="
                    font-raleway
                    text-xs
                    text-white/40
                  "
                >
                  0{total}
                </span>
              </div>

              {/* NAVIGATION BUTTONS */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <button
                  type="button"
                  onClick={previous}
                  aria-label="Previous customer story"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/25
                    text-white
                    transition-all
                    duration-300
                    hover:border-[#E7D0B0]
                    hover:bg-[#E7D0B0]
                    hover:text-[#29211C]
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-[#E7D0B0]
                  "
                >
                  <ArrowLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next customer story"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/25
                    text-white
                    transition-all
                    duration-300
                    hover:border-[#E7D0B0]
                    hover:bg-[#E7D0B0]
                    hover:text-[#29211C]
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-[#E7D0B0]
                  "
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* EDITORIAL CLOSING LINE                              */}
        {/* ================================================== */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 15,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.65,
          }}
          className="
            mt-12
            flex
            flex-col
            items-center
            gap-5
            text-center
            sm:mt-16
          "
        >
          <span
            className="
              h-px
              w-12
              bg-[#A67C52]
            "
          />

          <p
            className="
              max-w-xl
              font-serif
              text-xl
              italic
              leading-8
              text-[#8D735A]
              sm:text-2xl
            "
          >
            Rooted in heritage. Connected by culture.
          </p>

          <p
            className="
              font-raleway
              text-[10px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-[#9B8B7B]
            "
          >
            DHMS International
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;