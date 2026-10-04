
import React from "react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import { Sparkles } from "lucide-react";

// ============================================================
// DHMS INTERNATIONAL
// PREMIUM LOADING EXPERIENCE
// ============================================================

interface LoadingAnimationProps {
  message?: string;
  fullscreen?: boolean;
}

const LoadingAnimation: React.FC<
  LoadingAnimationProps
> = ({
  message = "Preparing your experience",
  fullscreen = true,
}) => {
  const reduceMotion = useReducedMotion();

  const transitionDuration = reduceMotion ? 0 : 0.7;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={`
        relative
        isolate
        flex
        w-full
        min-w-0
        flex-col
        items-center
        justify-center
        overflow-hidden
        bg-[#211914]
        px-5
        py-16
        font-play
        text-[#F8F4EC]
        ${
          fullscreen
            ? "fixed inset-0 z-[9999] h-dvh"
            : "min-h-[360px]"
        }
      `}
    >
      {/* ================================================== */}
      {/* ATMOSPHERIC BACKGROUND                             */}
      {/* ================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* TOP RIGHT GLOW */}

        <div
          className="
            absolute
            -right-32
            -top-40
            h-[350px]
            w-[350px]
            rounded-full
            bg-[#B58B56]/10
            blur-[100px]
            sm:h-[550px]
            sm:w-[550px]
          "
        />

        {/* BOTTOM LEFT GLOW */}

        <div
          className="
            absolute
            -bottom-40
            -left-32
            h-[350px]
            w-[350px]
            rounded-full
            bg-[#A67C52]/10
            blur-[100px]
            sm:h-[500px]
            sm:w-[500px]
          "
        />

        {/* SUBTLE VERTICAL LINES */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(90deg,#D7B791_1px,transparent_1px)]
            [background-size:100px_100px]
          "
        />

        {/* EDITORIAL FRAME */}

        <div
          className="
            absolute
            inset-4
            border
            border-[#D7B791]/10
            sm:inset-7
            lg:inset-10
          "
        />

        {/* CORNER DETAILS */}

        <div
          className="
            absolute
            left-4
            top-4
            h-8
            w-8
            border-l
            border-t
            border-[#D7B791]/50
            sm:left-7
            sm:top-7
            lg:left-10
            lg:top-10
          "
        />

        <div
          className="
            absolute
            bottom-4
            right-4
            h-8
            w-8
            border-b
            border-r
            border-[#D7B791]/50
            sm:bottom-7
            sm:right-7
            lg:bottom-10
            lg:right-10
          "
        />
      </div>

      {/* ================================================== */}
      {/* LOADING CONTENT                                   */}
      {/* ================================================== */}

      <div
        className="
          relative
          z-10
          flex
          w-full
          max-w-lg
          flex-col
          items-center
          text-center
        "
      >
        {/* SMALL INTRODUCTORY LABEL */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 15,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: transitionDuration,
          }}
          className="
            mb-10
            flex
            items-center
            gap-3
            sm:mb-12
          "
        >
          <span
            className="
              h-px
              w-7
              bg-[#C8A47C]
            "
          />

          <Sparkles
            size={13}
            strokeWidth={1.5}
            className="text-[#D7B791]"
          />

          <span
            className="
              font-raleway
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#D7B791]
              sm:text-[10px]
              sm:tracking-[0.25em]
            "
          >
            An Expression of Culture
          </span>

          <span
            className="
              h-px
              w-7
              bg-[#C8A47C]
            "
          />
        </motion.div>

        {/* ================================================== */}
        {/* ANIMATED DHMS MONOGRAM                            */}
        {/* ================================================== */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0.85,
                }
          }
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: transitionDuration,
            ease: "easeOut",
          }}
          className="
            relative
            flex
            h-[160px]
            w-[160px]
            items-center
            justify-center
            sm:h-[205px]
            sm:w-[205px]
          "
        >
          {/* OUTER ROTATING RING */}

          <motion.div
            aria-hidden="true"
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: 360,
                  }
            }
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              inset-0
              rounded-full
              border
              border-[#D7B791]/25
              border-t-[#D7B791]
              border-r-[#D7B791]/60
            "
          />

          {/* SECOND RING — OPPOSITE DIRECTION */}

          <motion.div
            aria-hidden="true"
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: -360,
                  }
            }
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              inset-[10px]
              rounded-full
              border
              border-[#D7B791]/15
              border-b-[#C8A47C]
              sm:inset-[13px]
            "
          />

          {/* INNER CIRCLE */}

          <div
            className="
              absolute
              inset-[22px]
              rounded-full
              border
              border-[#D7B791]/20
              bg-[#30241D]
              shadow-[0_0_65px_rgba(183,139,86,0.08)]
              sm:inset-[28px]
            "
          />

          {/* SOFT INNER GLOW */}

          <motion.div
            aria-hidden="true"
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: [0.2, 0.65, 0.2],
                    scale: [0.92, 1.05, 0.92],
                  }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              inset-[35px]
              rounded-full
              bg-[#D7B791]/10
              blur-2xl
              sm:inset-[45px]
            "
          />

          {/* CENTRAL BRAND MARK */}

          <div
            className="
              relative
              z-10
              flex
              flex-col
              items-center
              justify-center
            "
          >
            <motion.span
              animate={
                reduceMotion
                  ? undefined
                  : {
                      opacity: [0.8, 1, 0.8],
                    }
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                font-serif
                text-[74px]
                font-normal
                italic
                leading-none
                tracking-[-0.1em]
                text-[#E4C5A0]
                sm:text-[96px]
              "
            >
              D
            </motion.span>

            <span
              className="
                mt-1
                font-raleway
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.25em]
                text-[#C8A47C]
                sm:text-[9px]
              "
            >
              DHMS
            </span>
          </div>
        </motion.div>

        {/* ================================================== */}
        {/* BRAND NAME                                       */}
        {/* ================================================== */}

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
            duration: transitionDuration,
            delay: reduceMotion ? 0 : 0.3,
          }}
          className="
            mt-10
            flex
            flex-col
            items-center
            sm:mt-12
          "
        >
          <h2
            className="
              font-raleway
              text-[clamp(1.75rem,5vw,2.75rem)]
              font-semibold
              leading-tight
              tracking-[-0.06em]
              text-[#F8F4EC]
            "
          >
            DHMS
            <span className="text-[#D7B791]">
              .
            </span>
          </h2>

          <p
            className="
              mt-2
              font-raleway
              text-[9px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-[#C8A47C]
              sm:text-[10px]
              sm:tracking-[0.4em]
            "
          >
            International
          </p>
        </motion.div>

        {/* BRAND STATEMENT */}

        <motion.p
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
            duration: transitionDuration,
            delay: reduceMotion ? 0 : 0.5,
          }}
          className="
            mt-7
            max-w-xs
            font-serif
            text-lg
            italic
            leading-7
            text-[#C5AF98]
            sm:text-xl
          "
        >
          Rooted in heritage.
          <br />
          Made for your everyday.
        </motion.p>

        {/* ================================================== */}
        {/* LOADING PROGRESS                                  */}
        {/* ================================================== */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 10,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: transitionDuration,
            delay: reduceMotion ? 0 : 0.7,
          }}
          className="
            mt-10
            flex
            w-full
            max-w-[250px]
            flex-col
            items-center
            sm:mt-12
            sm:max-w-[290px]
          "
        >
          {/* TRACK */}

          <div
            aria-hidden="true"
            className="
              relative
              h-px
              w-full
              overflow-hidden
              bg-[#D7B791]/25
            "
          >
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: ["-100%", "300%"],
                    }
              }
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                h-full
                w-1/3
                bg-gradient-to-r
                from-transparent
                via-[#D7B791]
                to-transparent
              "
            />
          </div>

          {/* LOADING MESSAGE */}

          <div
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <p
              className="
                font-raleway
                text-[10px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-[#C8B6A4]
                sm:tracking-[0.2em]
              "
            >
              {message}
            </p>

            {/* ANIMATED DOTS */}

            <span
              aria-hidden="true"
              className="
                flex
                items-center
                gap-1
              "
            >
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: [0.25, 1, 0.25],
                        }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                  className="
                    h-1
                    w-1
                    rounded-full
                    bg-[#D7B791]
                  "
                />
              ))}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ================================================== */}
      {/* BOTTOM BRAND SIGNATURE                             */}
      {/* ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-8
          left-0
          right-0
          hidden
          items-center
          justify-center
          gap-3
          sm:flex
        "
      >
        <span
          className="
            h-px
            w-6
            bg-[#D7B791]/40
          "
        />

        <p
          className="
            font-raleway
            text-[9px]
            font-medium
            uppercase
            tracking-[0.23em]
            text-[#9F8A76]
          "
        >
          Fashion · Beauty · Self-Care
        </p>

        <span
          className="
            h-px
            w-6
            bg-[#D7B791]/40
          "
        />
      </div>
    </div>
  );
};

export default LoadingAnimation;