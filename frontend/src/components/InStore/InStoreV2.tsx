
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  MapPin,
  ShoppingBag,
} from "lucide-react";

import { useScroll } from "../Context/ScrollProvider";

// ============================================================
// DHMS INTERNATIONAL
// THE IN-STORE EDIT
// ============================================================

const inStoreItems = [
  {
    id: "01",
    name: "Kaftan Dresses",
    shortName: "Kaftans",
    image: "/purple-kaftan.jpg",
    category: "Women Dresses",
    badge: "Customer Favorite",
    headline: "A statement in every stitch.",
    description:
      "Vibrant prints, graceful silhouettes, and timeless elegance. Discover beautiful kaftans designed to celebrate individuality and African-inspired style.",
    detail: "Expressive prints. Effortless elegance.",
  },
  {
    id: "02",
    name: "Body Oils",
    shortName: "Body Oils",
    image: "/Michelle Obama oil.png",
    category: "Body Products",
    badge: "Best Seller",
    headline: "A little luxury, every day.",
    description:
      "Discover scented body oils that bring richness, hydration, and a touch of indulgence to your everyday self-care ritual.",
    detail: "Nourishment. Fragrance. Radiance.",
  },
  {
    id: "03",
    name: "Hair Care",
    shortName: "Hair Care",
    image: "/hair_category.jpg",
    category: "Hair Care",
    badge: "Staff Pick",
    headline: "Your crown, your expression.",
    description:
      "Explore hair care and beautiful textures selected for versatile styling, protective looks, and the freedom to express your personal beauty.",
    detail: "Beautiful textures. Endless possibilities.",
  },
  {
    id: "04",
    name: "Shea & Black Soap Sets",
    shortName: "Shea & Soap",
    image: "/shea butter.webp",
    category: "Body Products",
    badge: "New Arrival",
    headline: "Beauty rooted in tradition.",
    description:
      "Discover the simplicity of traditional African beauty care through nourishing shea butter and black soap essentials.",
    detail: "Traditional care. Everyday beauty.",
  },
  {
    id: "05",
    name: "Headwraps & Scarves",
    shortName: "Headwraps",
    image: "/headwrap.jpg",
    category: "Headwraps & Accessories",
    badge: "In-Store Only",
    headline: "Wear your heritage beautifully.",
    description:
      "From expressive colors to beautiful patterns, explore headwraps and scarves that bring cultural identity and personal style together.",
    detail: "Bold patterns. Beautiful expression.",
  },
  {
    id: "06",
    name: "Men’s Dashiki Tops",
    shortName: "Dashikis",
    image: "/blue-pink-shirt.jpg",
    category: "Men Shirts",
    badge: "Hot Pick",
    headline: "Tradition never goes out of style.",
    description:
      "Discover expressive dashiki tops that bring African-inspired design, bold color, and modern versatility to your wardrobe.",
    detail: "Cultural identity. Confident style.",
  },
];

const STORE_ADDRESS =
  "137 Spotsylvania Mall Dr, Fredericksburg, VA 22407";

const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(STORE_ADDRESS);

const TOTAL = inStoreItems.length;

// ============================================================
// SHARED MOTION
// ============================================================

const reveal = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  visible: {
    opacity: 1,
    y: 0,
  },
};

// ============================================================
// COMPONENT
// ============================================================

const InStore: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { registerSection } = useScroll();

  const reduceMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);

  const active = inStoreItems[activeIndex];

  const touchStart = useRef<{
    x: number;
    y: number;
  } | null>(null);

  // ----------------------------------------------------------
  // REGISTER SECTION
  // ----------------------------------------------------------

  useEffect(() => {
    registerSection(sectionRef);
  }, [registerSection]);

  // ----------------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------------

  const nextItem = () => {
    setActiveIndex((current) => (current + 1) % TOTAL);
  };

  const previousItem = () => {
    setActiveIndex(
      (current) => (current - 1 + TOTAL) % TOTAL
    );
  };

  const selectItem = (index: number) => {
    setActiveIndex(index);
  };

  // ----------------------------------------------------------
  // MOBILE SWIPE
  // ----------------------------------------------------------

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    touchStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  };

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (!touchStart.current) return;

    const diffX =
      event.changedTouches[0].clientX -
      touchStart.current.x;

    const diffY =
      event.changedTouches[0].clientY -
      touchStart.current.y;

    touchStart.current = null;

    // Only react to deliberate horizontal swipes.
    // Vertical scrolling continues working normally.

    if (
      Math.abs(diffX) < 55 ||
      Math.abs(diffX) <= Math.abs(diffY)
    ) {
      return;
    }

    if (diffX < 0) {
      nextItem();
    } else {
      previousItem();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="InStore"
      className="
        relative
        isolate
        w-full
        min-w-0
        overflow-hidden
        bg-[#F8F5EF]
        text-[#29211C]
      "
    >
      {/* ================================================== */}
      {/* SECTION INTRO                                      */}
      {/* ================================================== */}

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1500px]
          px-4
          pb-12
          pt-20
          sm:px-6
          sm:pb-16
          sm:pt-24
          lg:px-12
          lg:pb-20
          lg:pt-32
          xl:px-16
        "
      >
        {/* SMALL EDITORIAL LABEL */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            mb-8
            flex
            items-center
            gap-4
          "
        >
          <span
            className="
              h-px
              w-10
              bg-[#A97A49]
            "
          />

          <span
            className="
              font-raleway
              text-[10px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-[#9B724B]
              sm:text-xs
            "
          >
            DHMS International / The In-Store Edit
          </span>
        </motion.div>

        {/* MAIN EDITORIAL HEADING */}

        <div
          className="
            grid
            gap-8
            lg:grid-cols-[1.25fr_0.75fr]
            lg:items-end
            lg:gap-16
          "
        >
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{
              duration: 0.75,
              delay: 0.1,
            }}
          >
            <h2
              className="
                max-w-[950px]
                font-raleway
                text-[clamp(2.7rem,7.4vw,6.8rem)]
                font-semibold
                leading-[1.02]
                tracking-[-0.065em]
                text-[#29211C]
              "
            >
              Some things
              <br />

              are better

              <span
                className="
                  mt-1
                  block
                  font-serif
                  font-normal
                  italic
                  tracking-[-0.065em]
                  text-[#A67C52]
                "
              >
                in person.
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{
              duration: 0.75,
              delay: 0.2,
            }}
            className="
              flex
              max-w-md
              flex-col
              gap-6
              lg:pb-3
            "
          >
            <span
              className="
                font-raleway
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#A67C52]
              "
            >
              An invitation to explore
            </span>

            <p
              className="
                font-play
                text-base
                leading-8
                text-[#756B62]
                sm:text-lg
                sm:leading-9
              "
            >
              The richness of a fragrance.
              The texture of a fabric.
              The beauty of finding something
              that feels entirely your own.
            </p>

            <p
              className="
                font-play
                text-sm
                leading-7
                text-[#8E8174]
              "
            >
              Discover our curated selection
              of African-inspired fashion,
              beauty, and everyday essentials.
            </p>

            <div
              className="
                flex
                items-center
                gap-3
                font-raleway
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#A67C52]
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#A67C52]
                "
              />

              Explore the collection below
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================================================== */}
      {/* THE FEATURED COLLECTION                            */}
      {/* ================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-3
          sm:px-6
          lg:px-12
          xl:px-16
        "
      >
        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 35 }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{ duration: 0.8 }}
          className="
            relative
            grid
            min-w-0
            overflow-hidden
            bg-[#241C18]
            lg:grid-cols-[1.08fr_0.92fr]
          "
        >
          {/* ============================================== */}
          {/* FEATURED IMAGE                                 */}
          {/* ============================================== */}

          <div
            className="
              relative
              min-w-0
              overflow-hidden
              bg-[#C6B29A]
            "
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* MOBILE IMAGE / DESKTOP FEATURE IMAGE */}

            <div
              className="
                relative
                aspect-[5/4]
                w-full
                overflow-hidden
                sm:aspect-[4/3]
                lg:aspect-auto
                lg:h-full
                lg:min-h-[550px]
                xl:min-h-[640px]
              "
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={active.image}
                  src={active.image}
                  alt={active.name}
                  loading="lazy"
                  decoding="async"
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          scale: 1.055,
                        }
                  }
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={
                    reduceMotion
                      ? { opacity: 1 }
                      : {
                          opacity: 0,
                          scale: 1.025,
                        }
                  }
                  transition={{
                    duration: reduceMotion
                      ? 0
                      : 0.5,
                    ease: "easeOut",
                  }}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                  "
                />
              </AnimatePresence>

              {/* DEPTH GRADIENT */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#160F0C]/55
                  via-transparent
                  to-black/10
                "
              />

              {/* IMAGE TOP BRAND */}

              <div
                className="
                  absolute
                  left-5
                  top-5
                  flex
                  items-center
                  gap-3
                  sm:left-8
                  sm:top-8
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/70
                    bg-black/10
                    font-serif
                    text-sm
                    italic
                    text-white
                    backdrop-blur-sm
                    sm:h-12
                    sm:w-12
                  "
                >
                  D
                </div>

                <span
                  className="
                    font-raleway
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-white
                    sm:text-[10px]
                  "
                >
                  DHMS / Curated Collection
                </span>
              </div>

              {/* IMAGE BOTTOM INFORMATION */}

              <div
                className="
                  absolute
                  bottom-5
                  left-5
                  right-5
                  flex
                  items-end
                  justify-between
                  gap-4
                  sm:bottom-8
                  sm:left-8
                  sm:right-8
                "
              >
                <span
                  className="
                    font-raleway
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-white/90
                  "
                >
                  {active.detail}
                </span>

                <span
                  className="
                    shrink-0
                    font-raleway
                    text-sm
                    font-medium
                    tracking-[0.12em]
                    text-white
                  "
                >
                  {active.id}

                  <span className="mx-2 text-white/50">
                    /
                  </span>

                  {String(TOTAL).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* ============================================== */}
          {/* FEATURED PRODUCT DETAILS                       */}
          {/* ============================================== */}

          <div
            className="
              relative
              flex
              min-w-0
              flex-col
              justify-between
              overflow-hidden
              px-6
              py-10
              text-[#F8F4EC]
              sm:px-10
              sm:py-12
              lg:px-12
              lg:py-14
              xl:px-16
              xl:py-16
            "
          >
            {/* SUBTLE EDITORIAL WATERMARK */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-16
                -top-24
                select-none
                font-serif
                text-[340px]
                leading-none
                text-white/[0.025]
              "
            >
              D
            </div>

            {/* TOP LABEL */}

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
                  tracking-[0.22em]
                  text-[#C4A27E]
                "
              >
                The Featured Edit
              </span>

              <span
                className="
                  font-raleway
                  text-[10px]
                  font-medium
                  tracking-[0.13em]
                  text-white/40
                "
              >
                {active.id} / 06
              </span>
            </div>

            {/* ANIMATED PRODUCT CONTENT */}

            <div
              className="
                relative
                z-10
                flex
                flex-1
                flex-col
                justify-center
                py-10
                sm:py-14
                lg:py-10
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
                          y: 16,
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
                          y: -10,
                        }
                  }
                  transition={{
                    duration: reduceMotion
                      ? 0
                      : 0.38,
                  }}
                >
                  {/* PRODUCT CATEGORY */}

                  <div
                    className="
                      mb-6
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                  >
                    <span
                      className="
                        h-px
                        w-7
                        bg-[#C4A27E]
                      "
                    />

                    <span
                      className="
                        font-raleway
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#C4A27E]
                      "
                    >
                      {active.category}
                    </span>

                    <span
                      className="
                        border
                        border-[#C4A27E]/35
                        px-2.5
                        py-1
                        font-raleway
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.08em]
                        text-[#DDC6AC]
                      "
                    >
                      {active.badge}
                    </span>
                  </div>

                  {/* EDITORIAL PRODUCT HEADLINE */}

                  <h3
                    className="
                      max-w-[490px]
                      font-serif
                      text-[clamp(2.5rem,4vw,4.8rem)]
                      font-normal
                      leading-[1.08]
                      tracking-[-0.045em]
                      text-[#F8F4EC]
                    "
                  >
                    {active.headline}
                  </h3>

                  {/* PRODUCT DESCRIPTION */}

                  <p
                    className="
                      mt-6
                      max-w-[420px]
                      font-play
                      text-sm
                      leading-7
                      text-[#C2B7AB]
                      sm:text-base
                      sm:leading-8
                    "
                  >
                    {active.description}
                  </p>

                  {/* PRODUCT AVAILABILITY */}

                  <div
                    className="
                      mt-8
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-[#C4A27E]
                      "
                    />

                    <span
                      className="
                        font-raleway
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.12em]
                        text-[#C2B7AB]
                      "
                    >
                      Explore our in-store collection
                    </span>
                  </div>

                  {/* MAIN CTA */}

                  <Link
                    to="/shop"
                    state={{
                      category: active.category,
                    }}
                    className="
                      group
                      mt-9
                      inline-flex
                      min-h-[52px]
                      w-full
                      items-center
                      justify-between
                      gap-4
                      bg-[#E7D0B0]
                      px-5
                      py-3
                      font-raleway
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.1em]
                      text-[#241C18]
                      transition-all
                      duration-300
                      hover:bg-[#F4E3CB]
                      focus-visible:outline
                      focus-visible:outline-2
                      focus-visible:outline-offset-4
                      focus-visible:outline-[#E7D0B0]
                      sm:w-fit
                      sm:min-w-[235px]
                    "
                  >
                    View the Collection

                    <ArrowUpRight
                      size={17}
                      className="
                        shrink-0
                        transition-transform
                        duration-300
                        group-hover:-translate-y-0.5
                        group-hover:translate-x-0.5
                      "
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* NAVIGATION FOOTER */}

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
              <span
                className="
                  font-raleway
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.16em]
                  text-white/50
                "
              >
                Discover more
              </span>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                {/* PREVIOUS */}

                <button
                  type="button"
                  onClick={previousItem}
                  aria-label="Previous collection item"
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
                    hover:text-[#241C18]
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-[#E7D0B0]
                  "
                >
                  <ArrowLeft size={18} />
                </button>

                {/* NEXT */}

                <button
                  type="button"
                  onClick={nextItem}
                  aria-label="Next collection item"
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
                    hover:text-[#241C18]
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
        </motion.div>

        {/* ================================================== */}
        {/* COLLECTION SELECTOR                                */}
        {/* ================================================== */}

        <div
          className="
            mt-7
            min-w-0
            sm:mt-9
          "
        >
          {/* SELECTOR HEADER */}

          <div
            className="
              mb-5
              flex
              items-center
              justify-between
              gap-4
              px-1
            "
          >
            <p
              className="
                font-raleway
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#9B724B]
              "
            >
              Explore the Collection
            </p>

            <p
              className="
                font-raleway
                text-[10px]
                uppercase
                tracking-[0.1em]
                text-[#8C8176]
              "
            >
              {TOTAL} Curated Categories
            </p>
          </div>

          {/* RESPONSIVE THUMBNAIL RAIL */}

          <div
            className="
              flex
              min-w-0
              snap-x
              snap-mandatory
              gap-3
              overflow-x-auto
              overscroll-x-contain
              pb-3
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              sm:gap-4
              lg:grid
              lg:grid-cols-6
              lg:overflow-visible
              lg:pb-0
            "
          >
            {inStoreItems.map((item, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectItem(index)}
                  aria-pressed={isActive}
                  aria-label={`Show ${item.name}`}
                  className={`
                    group
                    relative
                    flex
                    w-[128px]
                    shrink-0
                    snap-start
                    flex-col
                    text-left
                    outline-none
                    transition-all
                    duration-300
                    sm:w-[155px]
                    lg:w-full
                    lg:min-w-0
                    ${
                      isActive
                        ? "opacity-100"
                        : "opacity-75 hover:opacity-100"
                    }
                  `}
                >
                  {/* THUMBNAIL IMAGE */}

                  <div
                    className={`
                      relative
                      aspect-[4/4.5]
                      w-full
                      overflow-hidden
                      bg-[#E4D9CB]
                      ring-offset-4
                      ring-offset-[#F8F5EF]
                      transition-all
                      duration-300
                      group-focus-visible:ring-2
                      group-focus-visible:ring-[#A67C52]
                      ${
                        isActive
                          ? "ring-2 ring-[#A67C52]"
                          : "ring-1 ring-[#E3D9CB]"
                      }
                    `}
                  >
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={`
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        ${
                          isActive
                            ? "scale-105"
                            : "group-hover:scale-105"
                        }
                      `}
                    />

                    {/* IMAGE INDEX */}

                    <span
                      className="
                        absolute
                        left-2
                        top-2
                        bg-[#F8F5EF]/90
                        px-2
                        py-1
                        font-raleway
                        text-[9px]
                        font-bold
                        text-[#49392B]
                      "
                    >
                      {item.id}
                    </span>

                    {/* SELECTED INDICATOR */}

                    {isActive && (
                      <span
                        className="
                          absolute
                          bottom-0
                          left-0
                          h-[3px]
                          w-full
                          bg-[#A67C52]
                        "
                      />
                    )}
                  </div>

                  {/* THUMBNAIL NAME */}

                  <div
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-1
                      pt-3
                    "
                  >
                    <span
                      className={`
                        min-w-0
                        font-raleway
                        text-[11px]
                        font-semibold
                        leading-4
                        transition-colors
                        sm:text-xs
                        ${
                          isActive
                            ? "text-[#9B724B]"
                            : "text-[#554A40]"
                        }
                      `}
                    >
                      {item.shortName}
                    </span>

                    {isActive && (
                      <span
                        className="
                          h-1
                          w-1
                          shrink-0
                          rounded-full
                          bg-[#A67C52]
                        "
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* SELECTOR FOOTER */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              gap-4
              border-t
              border-[#DCD2C5]
              pt-4
            "
          >
            <span
              className="
                font-raleway
                text-[10px]
                uppercase
                tracking-[0.12em]
                text-[#928477]
              "
            >
              Select a collection to explore
            </span>

            <span
              className="
                hidden
                font-raleway
                text-[10px]
                uppercase
                tracking-[0.12em]
                text-[#928477]
                sm:block
              "
            >
              DHMS / Fredericksburg, VA
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* BOUTIQUE VISIT SECTION                              */}
      {/* ================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-4
          pb-20
          pt-24
          sm:px-6
          sm:pb-24
          sm:pt-28
          lg:px-12
          lg:pb-32
          lg:pt-36
          xl:px-16
        "
      >
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
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="
            grid
            gap-12
            border-t
            border-[#DCD2C5]
            pt-12
            sm:pt-16
            lg:grid-cols-[1fr_1fr]
            lg:items-center
            lg:gap-20
          "
        >
          {/* LEFT — INVITATION */}

          <div>
            <div
              className="
                mb-5
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  w-8
                  bg-[#A67C52]
                "
              />

              <span
                className="
                  font-raleway
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#A67C52]
                "
              >
                Visit The Boutique
              </span>
            </div>

            <h3
              className="
                max-w-[550px]
                font-serif
                text-[clamp(2.5rem,5vw,4.5rem)]
                font-normal
                leading-[1.1]
                tracking-[-0.05em]
                text-[#29211C]
              "
            >
              Come for the collection.

              <span
                className="
                  mt-2
                  block
                  italic
                  text-[#A67C52]
                "
              >
                Stay for the experience.
              </span>
            </h3>

            <p
              className="
                mt-6
                max-w-md
                font-play
                text-sm
                leading-8
                text-[#756B62]
                sm:text-base
              "
            >
              There's something special about
              discovering your next favorite
              piece in person.

              Visit DHMS International in
              Fredericksburg and explore
              our collection up close.
            </p>

            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                mt-8
                inline-flex
                min-h-[48px]
                items-center
                gap-3
                border-b
                border-[#A67C52]
                pb-2
                font-raleway
                text-xs
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#8D623B]
                transition-all
                hover:gap-4
                hover:text-[#29211C]
              "
            >
              Get Directions

              <ArrowUpRight
                size={17}
                className="
                  transition-transform
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </a>
          </div>

          {/* RIGHT — STORE DETAILS */}

          <div
            className="
              relative
              overflow-hidden
              bg-[#EDE4D8]
              px-6
              py-8
              sm:px-9
              sm:py-10
              lg:px-10
              lg:py-12
            "
          >
            {/* STORE CARD HEADING */}

            <div
              className="
                mb-9
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-[#D4C5B3]
                pb-6
              "
            >
              <div>
                <p
                  className="
                    font-raleway
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-[#A67C52]
                  "
                >
                  Our Location
                </p>

                <h4
                  className="
                    mt-2
                    font-serif
                    text-2xl
                    text-[#29211C]
                    sm:text-3xl
                  "
                >
                  Visit DHMS
                </h4>
              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C8B7A0]
                  font-serif
                  text-lg
                  italic
                  text-[#9B724B]
                "
              >
                D
              </div>
            </div>

            {/* ADDRESS */}

            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <MapPin
                size={20}
                strokeWidth={1.5}
                className="
                  mt-1
                  shrink-0
                  text-[#A67C52]
                "
              />

              <div>
                <p
                  className="
                    font-raleway
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-[#9B724B]
                  "
                >
                  Find Us
                </p>

                <p
                  className="
                    mt-2
                    font-play
                    text-sm
                    leading-7
                    text-[#49392B]
                    sm:text-base
                  "
                >
                  137 Spotsylvania Mall Dr
                  <br />
                  Fredericksburg, VA 22407
                </p>
              </div>
            </div>

            {/* DIVIDER */}

            <div
              className="
                my-7
                h-px
                w-full
                bg-[#D4C5B3]
              "
            />

            {/* HOURS */}

            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <Clock3
                size={20}
                strokeWidth={1.5}
                className="
                  mt-1
                  shrink-0
                  text-[#A67C52]
                "
              />

              <div>
                <p
                  className="
                    font-raleway
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-[#9B724B]
                  "
                >
                  Pickup Hours
                </p>

                <p
                  className="
                    mt-2
                    font-play
                    text-sm
                    leading-7
                    text-[#49392B]
                    sm:text-base
                  "
                >
                  Monday – Saturday
                  <br />
                  10:00 AM – 6:00 PM
                </p>
              </div>
            </div>

            {/* BOTTOM */}

            <div
              className="
                mt-9
                flex
                flex-wrap
                items-center
                gap-3
                border-t
                border-[#D4C5B3]
                pt-6
              "
            >
              <ShoppingBag
                size={16}
                className="text-[#A67C52]"
              />

              <span
                className="
                  font-raleway
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.13em]
                  text-[#756B62]
                "
              >
                Walk-ins Welcome
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InStore;