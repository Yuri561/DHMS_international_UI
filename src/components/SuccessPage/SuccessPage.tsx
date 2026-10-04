
import React from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Home,
  Mail,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";

// ============================================================
// DHMS INTERNATIONAL
// ORDER CONFIRMATION PAGE
// ============================================================

const SuccessPage: React.FC = () => {
  const reduceMotion = useReducedMotion();

  const [searchParams] = useSearchParams();

  // Stripe can return the Checkout Session ID in
  // the success URL.
  //
  // This identifies the checkout session but does
  // not independently prove that payment succeeded.

  const sessionId = searchParams.get("session_id");

  const animationDuration = reduceMotion ? 0 : 0.6;

  return (
    <main
      id="order-success"
      className="
        relative
        isolate
        min-h-screen
        w-full
        min-w-0
        overflow-hidden
        bg-[#F8F5EF]
        font-play
        text-[#29211C]
      "
    >
      {/* =============================================== */}
      {/* BACKGROUND                                    */}
      {/* =============================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-32
          top-0
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#D7B791]/15
          blur-[110px]
        "
      />

      {/* =============================================== */}
      {/* MAIN CONTENT                                  */}
      {/* =============================================== */}

      <section
        className="
          relative
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-5xl
          flex-col
          items-center
          justify-center
          px-4
          pb-16
          pt-32
          sm:px-6
          sm:pt-36
          lg:py-32
        "
      >
        {/* BRAND LABEL */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 15 }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: animationDuration,
          }}
          className="
            mb-8
            flex
            items-center
            gap-3
          "
        >
          <span className="h-px w-8 bg-[#A67C52]" />

          <span
            className="
              font-raleway
              text-[10px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#9B724B]
            "
          >
            DHMS International
          </span>

          <span className="h-px w-8 bg-[#A67C52]" />
        </motion.div>

        {/* ============================================= */}
        {/* CONFIRMATION CARD                            */}
        {/* ============================================= */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 25,
                  scale: 0.98,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: animationDuration,
            delay: reduceMotion ? 0 : 0.1,
          }}
          className="
            relative
            w-full
            overflow-hidden
            bg-white
            shadow-[0_25px_90px_rgba(41,33,28,0.07)]
          "
        >
          {/* TOP ACCENT */}

          <div className="h-[3px] w-full bg-[#A67C52]" />

          <div
            className="
              flex
              flex-col
              items-center
              px-5
              pb-12
              pt-12
              text-center
              sm:px-12
              sm:pb-16
              sm:pt-16
              lg:px-20
              lg:pt-20
            "
          >
            {/* ANIMATED SUCCESS ICON */}

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: 0.7,
                    }
              }
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: animationDuration,
                delay: reduceMotion ? 0 : 0.25,
                type: "spring",
                stiffness: 130,
              }}
              className="
                relative
                mb-9
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                border
                border-[#D7B791]
                bg-[#F5EDE2]
                sm:h-28
                sm:w-28
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-[#29211C]
                  text-[#D7B791]
                  sm:h-20
                  sm:w-20
                "
              >
                <Check
                  size={35}
                  strokeWidth={1.5}
                />
              </div>
            </motion.div>

            {/* EYEBROW */}

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
              Your DHMS Experience
            </p>

            {/* MAIN HEADING */}

            <h1
              className="
                mt-5
                font-raleway
                text-[clamp(2.5rem,6vw,5rem)]
                font-semibold
                leading-[1.1]
                tracking-[-0.06em]
                text-[#29211C]
              "
            >
              Thank you for

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
                your order.
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-7
                max-w-xl
                font-play
                text-sm
                leading-8
                text-[#786D63]
                sm:text-base
                sm:leading-9
              "
            >
              Thank you for choosing DHMS International.

              We appreciate you shopping with us
              and look forward to helping you
              celebrate your unique style.
            </p>

            {/* PAYMENT INFORMATION */}

            <div
              className="
                mt-9
                w-full
                max-w-xl
                border
                border-[#E5DBCF]
                bg-[#F8F5EF]
                px-5
                py-6
                text-left
                sm:px-7
              "
            >
              <div className="flex items-start gap-4">
                <PackageCheck
                  size={22}
                  strokeWidth={1.5}
                  className="
                    mt-1
                    shrink-0
                    text-[#A67C52]
                  "
                />

                <div>
                  <h2
                    className="
                      font-raleway
                      text-sm
                      font-semibold
                      text-[#29211C]
                    "
                  >
                    Your checkout is complete
                  </h2>

                  <p
                    className="
                      mt-2
                      font-play
                      text-xs
                      leading-6
                      text-[#85786A]
                      sm:text-sm
                    "
                  >
                    Your order is being processed.
                    Once payment is confirmed, our
                    team can prepare your items
                    for fulfillment.
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-4
                  border-t
                  border-[#E5DBCF]
                  pt-5
                "
              >
                <Mail
                  size={20}
                  strokeWidth={1.5}
                  className="
                    mt-1
                    shrink-0
                    text-[#A67C52]
                  "
                />

                <div>
                  <h3
                    className="
                      font-raleway
                      text-sm
                      font-semibold
                      text-[#29211C]
                    "
                  >
                    Order updates
                  </h3>

                  <p
                    className="
                      mt-2
                      font-play
                      text-xs
                      leading-6
                      text-[#85786A]
                      sm:text-sm
                    "
                  >
                    Look out for your order
                    confirmation and payment receipt
                    in your email inbox.

                    If you have questions about
                    your order, our team is here
                    to help.
                  </p>
                </div>
              </div>
            </div>

            {/* SESSION REFERENCE */}

            {sessionId && (
              <div
                className="
                  mt-6
                  max-w-full
                  text-center
                "
              >
                <p
                  className="
                    font-raleway
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-[#938679]
                  "
                >
                  Checkout Reference
                </p>

                <p
                  className="
                    mt-2
                    max-w-full
                    break-all
                    font-mono
                    text-[10px]
                    leading-5
                    text-[#8D623B]
                    sm:text-xs
                  "
                >
                  {sessionId}
                </p>
              </div>
            )}

            {/* ============================================= */}
            {/* NAVIGATION                                  */}
            {/* ============================================= */}

            <div
              className="
                mt-10
                flex
                w-full
                max-w-xl
                flex-col
                gap-3
                sm:flex-row
              "
            >
              <Link
                to="/shop"
                className="
                  group
                  flex
                  min-h-[56px]
                  flex-1
                  items-center
                  justify-center
                  gap-3
                  bg-[#29211C]
                  px-5
                  py-4
                  font-raleway
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-white
                  transition-colors
                  hover:bg-[#8D623B]
                "
              >
                <ShoppingBag size={17} />

                Continue Shopping

                <ArrowRight
                  size={16}
                  className="
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </Link>

              <Link
                to="/home"
                className="
                  flex
                  min-h-[56px]
                  flex-1
                  items-center
                  justify-center
                  gap-3
                  border
                  border-[#D7C8B6]
                  px-5
                  py-4
                  font-raleway
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-[#49392B]
                  transition-colors
                  hover:border-[#A67C52]
                  hover:bg-[#F5EDE2]
                "
              >
                <Home size={17} />

                Back to Home

                <ChevronRight size={16} />
              </Link>
            </div>

            {/* CONTACT LINK */}

            <Link
              to="/contact"
              className="
                mt-8
                inline-flex
                min-h-11
                items-center
                gap-2
                font-raleway
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[#9B724B]
                transition-colors
                hover:text-[#29211C]
              "
            >
              Need help with your order?

              <ArrowUpRight size={15} />
            </Link>
          </div>
        </motion.div>

        {/* BOTTOM BRAND SIGNATURE */}

        <div
          className="
            mt-10
            flex
            items-center
            gap-3
            text-center
          "
        >
          <span className="h-px w-5 bg-[#C8B7A0]" />

          <span
            className="
              font-raleway
              text-[10px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-[#9B8B7B]
            "
          >
            Rooted in Heritage.
            Made for Your Everyday.
          </span>

          <span className="h-px w-5 bg-[#C8B7A0]" />
        </div>
      </section>
    </main>
  );
};

export default SuccessPage;