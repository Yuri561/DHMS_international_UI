
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { HashLink } from "react-router-hash-link";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import emailjs from "@emailjs/browser";

import { scrollWithOffset } from "@/scrollHelpers/ScrollOffset";

// ============================================================
// DHMS INTERNATIONAL
// PREMIUM EDITORIAL FOOTER
// ============================================================

// ------------------------------------------------------------
// EMAILJS CONFIGURATION
// ------------------------------------------------------------

const PUBLIC_KEY =
  import.meta.env.VITE_EMAIL_JS as string;

const SERVICE_ID =
  import.meta.env.VITE_SERVICE_ID as string;

const TEMPLATE_ID =
  import.meta.env.VITE_TEMPLATE_ID as string;

// ------------------------------------------------------------
// NAVIGATION
// ------------------------------------------------------------

const footerLinks = [
  {
    label: "Home",
    to: "/home#top",
  },
  {
    label: "Shop Collection",
    to: "/shop#top",
  },
  {
    label: "Our Story",
    to: "/about#top",
  },
  {
    label: "In-Store Collection",
    to: "/#InStore",
  },
  {
    label: "Customer Stories",
    to: "/#testimonials",
  },
];

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------

const Footer: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const resetTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const [status, setStatus] = useState<
    "idle" | "sending" | "ok" | "err"
  >("idle");

  // ----------------------------------------------------------
  // INITIALIZE EMAILJS
  // ----------------------------------------------------------

  useEffect(() => {
    if (PUBLIC_KEY) {
      emailjs.init({
        publicKey: PUBLIC_KEY,
      });
    }

    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  // ----------------------------------------------------------
  // NEWSLETTER REQUEST
  // ----------------------------------------------------------

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!formRef.current || status === "sending") {
      return;
    }

    if (
      !PUBLIC_KEY ||
      !SERVICE_ID ||
      !TEMPLATE_ID
    ) {
      console.error(
        "DHMS EmailJS configuration is missing."
      );

      setStatus("err");

      return;
    }

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    setStatus("sending");

    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current
      );

      setStatus("ok");

      formRef.current.reset();
    } catch (error) {
      console.error(
        "DHMS newsletter request failed:",
        error
      );

      setStatus("err");
    } finally {
      resetTimerRef.current = setTimeout(() => {
        setStatus("idle");
      }, 6000);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <footer
      id="footer"
      className="
        relative
        isolate
        w-full
        min-w-0
        overflow-hidden
        bg-[#211914]
        font-play
        text-[#F8F4EC]
      "
    >
      {/* ================================================== */}
      {/* TOP EDITORIAL BANNER                               */}
      {/* ================================================== */}

      <div
        className="
          relative
          overflow-hidden
          border-b
          border-white/10
          bg-[#2B2019]
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-24
            -top-40
            h-[350px]
            w-[350px]
            rounded-full
            bg-[#A67C52]/10
            blur-[110px]
          "
        />

        <div
          className="
            relative
            mx-auto
            flex
            w-full
            max-w-[1500px]
            flex-col
            gap-8
            px-5
            py-14
            sm:px-8
            sm:py-16
            lg:flex-row
            lg:items-end
            lg:justify-between
            lg:gap-16
            lg:px-12
            lg:py-20
            xl:px-16
          "
        >
          {/* EDITORIAL MESSAGE */}

          <div className="max-w-[850px]">
            <div className="mb-7 flex items-center gap-4">
              <span
                className="
                  h-px
                  w-9
                  bg-[#D2B08B]
                "
              />

              <p
                className="
                  font-raleway
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.23em]
                  text-[#D2B08B]
                "
              >
                DHMS International
              </p>
            </div>

            <h2
              className="
                font-raleway
                text-[clamp(2.7rem,6vw,5.8rem)]
                font-semibold
                leading-[1.06]
                tracking-[-0.065em]
                text-[#FBF7F0]
              "
            >
              Your culture.

              <span
                className="
                  mt-1
                  block
                  font-serif
                  font-normal
                  italic
                  tracking-[-0.05em]
                  text-[#D2B08B]
                "
              >
                Your expression.
              </span>
            </h2>

            <p
              className="
                mt-6
                max-w-[560px]
                text-sm
                leading-7
                text-[#C4B6A8]
                sm:text-base
                sm:leading-8
              "
            >
              Discover the beauty of heritage through
              thoughtfully curated fashion, beauty,
              and self-care essentials.
            </p>
          </div>

          {/* SHOP CTA */}

          <HashLink
            to="/shop#top"
            scroll={scrollWithOffset}
            className="
              group
              inline-flex
              min-h-[55px]
              w-full
              shrink-0
              items-center
              justify-between
              gap-6
              bg-[#D7B791]
              px-6
              py-4
              font-raleway
              text-[11px]
              font-bold
              uppercase
              tracking-[0.11em]
              text-[#261A14]
              transition-all
              duration-300
              hover:bg-[#F0D7B5]
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-4
              focus-visible:outline-[#D7B791]
              sm:w-fit
              sm:min-w-[230px]
            "
          >
            Explore the Collection

            <ArrowUpRight
              size={18}
              className="
                shrink-0
                transition-transform
                duration-300
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </HashLink>
        </div>
      </div>

      {/* ================================================== */}
      {/* MAIN FOOTER                                       */}
      {/* ================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-5
          pt-16
          sm:px-8
          sm:pt-20
          lg:px-12
          lg:pt-24
          xl:px-16
        "
      >
        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-x-10
            gap-y-14
            sm:grid-cols-2
            lg:grid-cols-12
            lg:gap-x-8
            xl:gap-x-12
          "
        >
          {/* ================================================== */}
          {/* COLUMN 1 — BRAND                                 */}
          {/* ================================================== */}

          <div
            className="
              min-w-0
              sm:col-span-2
              lg:col-span-4
            "
          >
            {/* BRAND IDENTITY */}

            <div>
              <span
                className="
                  font-serif
                  text-[clamp(3.2rem,5vw,5rem)]
                  font-normal
                  leading-none
                  tracking-[-0.075em]
                  text-[#F8F4EC]
                "
              >
                DHMS
                <span className="text-[#C8A47C]">
                  .
                </span>
              </span>

              <p
                className="
                  mt-3
                  font-raleway
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[#C8A47C]
                "
              >
                International LLC
              </p>
            </div>

            {/* BRAND DESCRIPTION */}

            <p
              className="
                mt-7
                max-w-[340px]
                text-sm
                leading-8
                text-[#B9AA9B]
              "
            >
              African-inspired fashion, beauty,
              and self-care, thoughtfully curated
              to celebrate culture, individuality,
              and everyday confidence.
            </p>

            {/* BRAND STATEMENT */}

            <div
              className="
                mt-8
                flex
                items-start
                gap-4
                border-l-2
                border-[#C8A47C]
                pl-5
              "
            >
              <p
                className="
                  max-w-[310px]
                  font-serif
                  text-lg
                  italic
                  leading-7
                  text-[#D6C1AA]
                "
              >
                Rooted in heritage.
                <br />
                Made for your everyday.
              </p>
            </div>

            {/* LOCATION */}

            <div
              className="
                mt-9
                inline-flex
                items-center
                gap-3
                text-[#A99A8C]
              "
            >
              <MapPin
                size={16}
                strokeWidth={1.6}
                className="shrink-0 text-[#C8A47C]"
              />

              <span
                className="
                  font-raleway
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.15em]
                "
              >
                Virginia, United States
              </span>
            </div>
          </div>

          {/* ================================================== */}
          {/* COLUMN 2 — NAVIGATION                            */}
          {/* ================================================== */}

          <div
            className="
              min-w-0
              lg:col-span-2
              lg:col-start-6
            "
          >
            <h3
              className="
                mb-7
                font-raleway
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#D2B08B]
              "
            >
              Explore
            </h3>

            <nav aria-label="Footer navigation">
              <ul className="space-y-1">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    <HashLink
                      to={link.to}
                      scroll={scrollWithOffset}
                      className="
                        group
                        inline-flex
                        min-h-10
                        items-center
                        gap-2
                        text-sm
                        text-[#B9AA9B]
                        transition-colors
                        duration-300
                        hover:text-[#F8F4EC]
                        focus-visible:text-white
                        focus-visible:outline
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-[#C8A47C]
                      "
                    >
                      <span
                        className="
                          h-px
                          w-0
                          bg-[#C8A47C]
                          transition-all
                          duration-300
                          group-hover:w-3
                        "
                      />

                      {link.label}
                    </HashLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ================================================== */}
          {/* COLUMN 3 — CONTACT                               */}
          {/* ================================================== */}

          <div
            className="
              min-w-0
              lg:col-span-2
            "
          >
            <h3
              className="
                mb-7
                font-raleway
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#D2B08B]
              "
            >
              Get in Touch
            </h3>

            <p
              className="
                max-w-[220px]
                text-sm
                leading-7
                text-[#B9AA9B]
              "
            >
              Have a question about our collection
              or need assistance with an order?
            </p>

            {/* PHONE */}

            <a
              href="tel:+15407574563"
              aria-label="Call DHMS International at 540-757-4563"
              className="
                group
                mt-7
                inline-flex
                min-h-11
                items-center
                gap-3
                text-sm
                text-[#F8F4EC]
                transition-colors
                duration-300
                hover:text-[#D2B08B]
              "
            >
              <Phone
                size={16}
                strokeWidth={1.6}
                className="
                  shrink-0
                  text-[#C8A47C]
                "
              />

              <span>+1 (540) 757-4563</span>

              <ArrowUpRight
                size={14}
                className="
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                  group-hover:opacity-100
                "
              />
            </a>

            {/* EMAIL / CONTACT NAVIGATION */}

            <HashLink
              to="/about#top"
              scroll={scrollWithOffset}
              className="
                group
                mt-4
                inline-flex
                min-h-10
                items-center
                gap-3
                text-sm
                text-[#B9AA9B]
                transition-colors
                duration-300
                hover:text-white
              "
            >
              <Mail
                size={16}
                strokeWidth={1.6}
                className="
                  shrink-0
                  text-[#C8A47C]
                "
              />

              <span>Learn more about DHMS</span>

              <ArrowUpRight
                size={14}
                className="
                  opacity-0
                  transition-opacity
                  group-hover:opacity-100
                "
              />
            </HashLink>
          </div>

          {/* ================================================== */}
          {/* COLUMN 4 — NEWSLETTER                            */}
          {/* ================================================== */}

          <div
            className="
              min-w-0
              sm:col-span-2
              lg:col-span-4
            "
          >
            <div className="mb-7 flex items-center gap-3">
              <span
                className="
                  h-px
                  w-6
                  bg-[#C8A47C]
                "
              />

              <h3
                className="
                  font-raleway
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#D2B08B]
                "
              >
                The DHMS Edit
              </h3>
            </div>

            <h4
              className="
                max-w-[340px]
                font-serif
                text-3xl
                font-normal
                leading-[1.2]
                tracking-[-0.035em]
                text-[#F8F4EC]
                sm:text-4xl
              "
            >
              A little culture
              <span
                className="
                  block
                  italic
                  text-[#C8A47C]
                "
              >
                in your inbox.
              </span>
            </h4>

            <p
              className="
                mt-5
                max-w-[360px]
                text-sm
                leading-7
                text-[#B9AA9B]
              "
            >
              Interested in new arrivals, collection
              updates, and in-store events?
              Leave your email to hear from us.
            </p>

            {/* ---------------------------------------------- */}
            {/* EMAIL FORM                                     */}
            {/* ---------------------------------------------- */}

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="mt-7"
            >
              <label
                htmlFor="dhms-newsletter-email"
                className="
                  mb-3
                  block
                  font-raleway
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.13em]
                  text-[#D2B08B]
                "
              >
                Email Address
              </label>

              <div
                className="
                  flex
                  min-w-0
                  flex-col
                  gap-3
                  min-[420px]:flex-row
                  min-[420px]:gap-0
                "
              >
                <input
                  id="dhms-newsletter-email"
                  type="email"
                  name="user_email"
                  placeholder="Your email address"
                  autoComplete="email"
                  inputMode="email"
                  required
                  disabled={status === "sending"}
                  className="
                    h-[54px]
                    w-full
                    min-w-0
                    flex-1
                    rounded-none
                    border
                    border-[#766455]
                    bg-[#342820]
                    px-4
                    font-play
                    text-sm
                    text-[#F8F4EC]
                    outline-none
                    transition-colors
                    duration-300
                    placeholder:text-[#9C8A79]
                    focus:border-[#D2B08B]
                    focus:bg-[#3C2E25]
                    disabled:opacity-60
                    min-[420px]:border-r-0
                  "
                />

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="
                    group
                    inline-flex
                    h-[54px]
                    w-full
                    shrink-0
                    cursor-pointer
                    items-center
                    justify-center
                    gap-3
                    bg-[#D7B791]
                    px-5
                    font-raleway
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.1em]
                    text-[#281A14]
                    transition-all
                    duration-300
                    hover:bg-[#F0D7B5]
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-[#D7B791]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    min-[420px]:w-auto
                  "
                >
                  {status === "sending" ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-[#281A14]/25
                          border-t-[#281A14]
                        "
                      />

                      Sending
                    </>
                  ) : status === "ok" ? (
                    <>
                      <Check size={16} />

                      Sent
                    </>
                  ) : (
                    <>
                      Get Updates

                      <Send
                        size={15}
                        className="
                          transition-transform
                          duration-300
                          group-hover:-translate-y-0.5
                          group-hover:translate-x-0.5
                        "
                      />
                    </>
                  )}
                </button>
              </div>

              {/* STATUS MESSAGE */}

              <div
                aria-live="polite"
                aria-atomic="true"
                className="
                  mt-3
                  min-h-[20px]
                "
              >
                {status === "ok" && (
                  <p
                    role="status"
                    className="
                      flex
                      items-start
                      gap-2
                      text-xs
                      leading-5
                      text-[#B9D6B5]
                    "
                  >
                    <Check
                      size={14}
                      className="mt-0.5 shrink-0"
                    />

                    Thanks! Your request has been sent.
                  </p>
                )}

                {status === "err" && (
                  <p
                    role="alert"
                    className="
                      text-xs
                      leading-5
                      text-[#F1AD9F]
                    "
                  >
                    We couldn't send your request.
                    Please try again.
                  </p>
                )}
              </div>

              {/* PRIVACY NOTE */}

              <p
                className="
                  mt-4
                  max-w-[370px]
                  font-play
                  text-[11px]
                  leading-6
                  text-[#9C8A79]
                "
              >
                Your email will be used to respond
                to your request for DHMS updates.
              </p>
            </form>
          </div>
        </div>

        {/* ================================================== */}
        {/* LARGE BRAND SIGNATURE                              */}
        {/* ================================================== */}

        <div
          className="
            relative
            mt-20
            overflow-hidden
            border-b
            border-t
            border-white/10
            py-8
            sm:mt-24
            sm:py-10
            lg:mt-28
            lg:py-12
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <span
              aria-hidden="true"
              className="
                block
                min-w-0
                font-raleway
                text-[clamp(2.7rem,10.8vw,10rem)]
                font-semibold
                leading-[0.9]
                tracking-[-0.09em]
                text-[#F8F4EC]
              "
            >
              DHMS
              <span className="text-[#C8A47C]">
                .
              </span>
            </span>

            <span
              className="
                hidden
                shrink-0
                font-raleway
                text-[10px]
                font-medium
                uppercase
                tracking-[0.22em]
                text-[#B9AA9B]
                md:block
              "
            >
              Rooted in Culture
              <br />
              Made for You
            </span>

            <span
              aria-hidden="true"
              className="
                hidden
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#C8A47C]/60
                font-serif
                text-xl
                italic
                text-[#C8A47C]
                lg:flex
              "
            >
              D
            </span>
          </div>
        </div>

        {/* ================================================== */}
        {/* BOTTOM BAR                                         */}
        {/* ================================================== */}

        <div
          className="
            flex
            flex-col
            gap-5
            py-7
            sm:py-8
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          {/* COPYRIGHT */}

          <p
            className="
              font-raleway
              text-[10px]
              leading-6
              tracking-[0.04em]
              text-[#A99A8C]
              sm:text-xs
            "
          >
            © {new Date().getFullYear()} DHMS
            International LLC. All rights reserved.
          </p>

          {/* BOTTOM NAVIGATION */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-6
              gap-y-3
            "
          >
            <HashLink
              to="/home#top"
              scroll={scrollWithOffset}
              className="
                font-raleway
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.1em]
                text-[#A99A8C]
                transition-colors
                hover:text-[#D2B08B]
              "
            >
              Back to Home
            </HashLink>

            <HashLink
              to="/shop#top"
              scroll={scrollWithOffset}
              className="
                font-raleway
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.1em]
                text-[#A99A8C]
                transition-colors
                hover:text-[#D2B08B]
              "
            >
              Shop Collection
            </HashLink>

            <a
              href="tel:+15407574563"
              className="
                font-raleway
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.1em]
                text-[#A99A8C]
                transition-colors
                hover:text-[#D2B08B]
              "
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;