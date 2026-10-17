
import React, { useRef, useState } from "react";

import { Link } from "react-router-dom";

import emailjs from "@emailjs/browser";

import { toast } from "react-toastify";

import { useForm } from "react-hook-form";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  Send,
  ShoppingBag,
} from "lucide-react";

// ============================================================
// DHMS INTERNATIONAL
// CONTACT PAGE
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
// FORM TYPES
// ------------------------------------------------------------

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

// ------------------------------------------------------------
// SUBJECT OPTIONS
// ------------------------------------------------------------

const subjectOptions = [
  "General Inquiry",
  "Order Support",
  "Product Information",
  "In-Store Pickup",
  "Partnership & Collaboration",
  "Other",
];

// ============================================================
// CONTACT COMPONENT
// ============================================================

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // ----------------------------------------------------------
  // SUBMIT CONTACT FORM
  // ----------------------------------------------------------

  const onSubmit = async (_data: FormData) => {
    if (!formRef.current) return;

    if (
      !PUBLIC_KEY ||
      !SERVICE_ID ||
      !TEMPLATE_ID
    ) {
      console.error(
        "DHMS EmailJS configuration is missing."
      );

      toast.error(
        "Our contact form is temporarily unavailable. Please try again later."
      );

      return;
    }

    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );

      reset();

      setIsSubmitted(true);

      toast.success(
        "Your message has been sent successfully!"
      );
    } catch (error) {
      console.error(
        "DHMS contact form error:",
        error
      );

      toast.error(
        "We couldn't send your message. Please try again."
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main
      id="contact"
      className="
        relative
        isolate
        min-h-screen
        w-full
        min-w-0
        overflow-x-clip
        bg-[#F8F5EF]
        font-play
        text-[#29211C]
      "
    >
      {/* ================================================== */}
      {/* PAGE INTRODUCTION                                  */}
      {/* ================================================== */}

      <section
        className="
          relative
          isolate
          overflow-hidden
          bg-[#29211C]
          px-5
          pb-16
          pt-32
          text-[#F8F4EC]
          sm:px-8
          sm:pb-20
          sm:pt-36
          lg:px-12
          lg:pb-24
          lg:pt-40
          xl:px-16
        "
      >
        {/* BACKGROUND DECORATION */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-20
            -top-28
            select-none
            font-serif
            text-[320px]
            leading-none
            text-white/[0.025]
            sm:text-[500px]
          "
        >
          D
        </div>

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-48
            -left-40
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#A67C52]/10
            blur-[110px]
          "
        />

        {/* CONTENT */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-[1450px]
          "
        >
          {/* EYEBROW */}

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
                w-10
                bg-[#D7B791]
              "
            />

            <span
              className="
                font-raleway
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#D7B791]
                sm:text-xs
              "
            >
              DHMS International / Contact
            </span>
          </div>

          {/* HEADING */}

          <div
            className="
              grid
              min-w-0
              gap-8
              lg:grid-cols-[1.1fr_0.9fr]
              lg:items-end
              lg:gap-16
            "
          >
            <div>
              <h1
                className="
                  font-raleway
                  text-[clamp(3rem,7vw,7rem)]
                  font-semibold
                  leading-[1.03]
                  tracking-[-0.065em]
                  text-[#F8F4EC]
                "
              >
                We'd love to

                <span
                  className="
                    mt-1
                    block
                    font-serif
                    font-normal
                    italic
                    text-[#D7B791]
                  "
                >
                  hear from you.
                </span>
              </h1>
            </div>

            <div className="max-w-md lg:pb-2">
              <p
                className="
                  text-sm
                  leading-8
                  text-[#D0C2B4]
                  sm:text-base
                  sm:leading-9
                "
              >
                Whether you have a question about
                our collection, need help with an
                order, or simply want to connect,
                we're here to help.
              </p>

              <p
                className="
                  mt-4
                  text-sm
                  leading-7
                  text-[#AFA092]
                "
              >
                Tell us what's on your mind,
                and our team will get back to you.
              </p>
            </div>
          </div>

          {/* BOTTOM DETAIL */}

          <div
            className="
              mt-12
              flex
              flex-wrap
              items-center
              justify-between
              gap-4
              border-t
              border-white/15
              pt-5
              sm:mt-16
            "
          >
            <span
              className="
                flex
                items-center
                gap-3
                font-raleway
                text-[10px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-[#C8B6A4]
              "
            >
              <MapPin
                size={16}
                className="text-[#D7B791]"
              />

              Virginia-based boutique
            </span>

            <span
              className="
                font-raleway
                text-[10px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-[#C8B6A4]
              "
            >
              Fashion · Beauty · Self-Care
            </span>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* CONTACT EXPERIENCE                                 */}
      {/* ================================================== */}

      <section
        className="
          relative
          w-full
          min-w-0
          px-4
          py-12
          sm:px-6
          sm:py-16
          lg:px-10
          lg:py-24
        "
      >
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-[1450px]
            min-w-0
            overflow-hidden
            bg-white
            shadow-[0_20px_80px_rgba(41,33,28,0.06)]
            lg:grid-cols-[0.82fr_1.18fr]
          "
        >
          {/* ================================================== */}
          {/* LEFT — BRAND / CONTACT INFORMATION                */}
          {/* ================================================== */}

          <div
            className="
              relative
              isolate
              flex
              min-w-0
              flex-col
              justify-between
              overflow-hidden
              bg-[#30231B]
              px-6
              py-10
              text-[#F8F4EC]
              sm:px-10
              sm:py-12
              lg:min-h-[720px]
              lg:px-12
              lg:py-14
              xl:px-14
            "
          >
            {/* VIDEO BACKGROUND */}

            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                z-0
                h-full
                w-full
                object-cover
                opacity-25
                motion-reduce:hidden
              "
            >
              <source
                src="/videos/signin.MP4"
                type="video/mp4"
              />
            </video>

            {/* VIDEO OVERLAY */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                z-0
                bg-gradient-to-b
                from-[#241912]/85
                via-[#241912]/80
                to-[#241912]/95
              "
            />

            {/* TOP CONTENT */}

            <div className="relative z-10">
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
                    bg-[#D7B791]
                  "
                />

                <span
                  className="
                    font-raleway
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#D7B791]
                  "
                >
                  A personal touch
                </span>
              </div>

              <h2
                className="
                  max-w-[440px]
                  font-serif
                  text-[clamp(2.3rem,4vw,4rem)]
                  font-normal
                  leading-[1.15]
                  tracking-[-0.045em]
                  text-[#F8F4EC]
                "
              >
                Every great connection
                begins with

                <span
                  className="
                    mt-1
                    block
                    italic
                    text-[#D7B791]
                  "
                >
                  a conversation.
                </span>
              </h2>

              <p
                className="
                  mt-6
                  max-w-[380px]
                  text-sm
                  leading-8
                  text-[#CDBFB1]
                "
              >
                At DHMS International, we believe
                shopping should feel personal.

                From discovering the right piece
                to answering your questions,
                we're happy to help you find
                what you're looking for.
              </p>

              {/* CONTACT DIVIDER */}

              <div
                className="
                  my-10
                  h-px
                  w-full
                  bg-white/15
                  sm:my-12
                "
              />

              {/* CONTACT METHODS */}

              <div className="space-y-8">
                {/* PHONE */}

                <div className="flex items-start gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-[#C8A47C]/45
                      text-[#D7B791]
                    "
                  >
                    <Phone
                      size={19}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        font-raleway
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-[#D7B791]
                      "
                    >
                      Call Us
                    </p>

                    <a
                      href="tel:+15407574563"
                      className="
                        mt-2
                        inline-flex
                        min-h-8
                        items-center
                        gap-2
                        text-sm
                        text-[#F8F4EC]
                        transition-colors
                        hover:text-[#D7B791]
                        sm:text-base
                      "
                    >
                      +1 (540) 757-4563

                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>

                {/* MESSAGE */}

                <div className="flex items-start gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-[#C8A47C]/45
                      text-[#D7B791]
                    "
                  >
                    <Mail
                      size={19}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        font-raleway
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-[#D7B791]
                      "
                    >
                      Send a Message
                    </p>

                    <p
                      className="
                        mt-2
                        max-w-xs
                        text-sm
                        leading-7
                        text-[#CDBFB1]
                      "
                    >
                      Complete our contact form,
                      and we'll respond to your inquiry.
                    </p>
                  </div>
                </div>

                {/* LOCATION */}

                <div className="flex items-start gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-[#C8A47C]/45
                      text-[#D7B791]
                    "
                  >
                    <MapPin
                      size={19}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        font-raleway
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-[#D7B791]
                      "
                    >
                      Our Boutique
                    </p>

                    <p
                      className="
                        mt-2
                        text-sm
                        leading-7
                        text-[#CDBFB1]
                      "
                    >
                      Fredericksburg, Virginia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* LEFT BOTTOM */}

            <div
              className="
                relative
                z-10
                mt-14
                border-t
                border-white/15
                pt-7
                lg:mt-12
              "
            >
              <p
                className="
                  font-serif
                  text-xl
                  italic
                  leading-8
                  text-[#D7B791]
                  sm:text-2xl
                "
              >
                Rooted in heritage.
                <br />
                Connected by culture.
              </p>

              <p
                className="
                  mt-5
                  font-raleway
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#AFA092]
                "
              >
                DHMS International LLC
              </p>
            </div>
          </div>

          {/* ================================================== */}
          {/* RIGHT — CONTACT FORM                            */}
          {/* ================================================== */}

          <div
            className="
              flex
              min-w-0
              flex-col
              justify-center
              px-5
              py-10
              sm:px-10
              sm:py-12
              lg:px-12
              lg:py-14
              xl:px-16
              xl:py-16
            "
          >
            {isSubmitted ? (
              /* ============================================== */
              /* SUCCESS STATE                                  */
              /* ============================================== */

              <div
                role="status"
                aria-live="polite"
                className="
                  flex
                  min-h-[420px]
                  flex-col
                  items-start
                  justify-center
                "
              >
                {/* SUCCESS ICON */}

                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D7B791]
                    bg-[#F5EDE2]
                    text-[#8D623B]
                  "
                >
                  <Check
                    size={28}
                    strokeWidth={1.7}
                  />
                </div>

                <p
                  className="
                    mt-8
                    font-raleway
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-[#A67C52]
                  "
                >
                  Message Received
                </p>

                <h2
                  className="
                    mt-4
                    font-serif
                    text-[clamp(2.3rem,5vw,3.8rem)]
                    leading-[1.12]
                    tracking-[-0.04em]
                    text-[#29211C]
                  "
                >
                  Thank you for
                  <br />

                  <span
                    className="
                      italic
                      text-[#A67C52]
                    "
                  >
                    reaching out.
                  </span>
                </h2>

                <p
                  className="
                    mt-6
                    max-w-md
                    text-sm
                    leading-8
                    text-[#786D63]
                  "
                >
                  Your message has been submitted.
                  We appreciate you taking the time
                  to connect with DHMS International.

                  Our team will be in touch.
                </p>

                {/* SUCCESS ACTIONS */}

                <div
                  className="
                    mt-9
                    flex
                    w-full
                    flex-col
                    gap-3
                    sm:w-auto
                    sm:flex-row
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setIsSubmitted(false)
                    }
                    className="
                      inline-flex
                      min-h-[52px]
                      w-full
                      items-center
                      justify-center
                      gap-3
                      bg-[#29211C]
                      px-6
                      font-raleway
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.1em]
                      text-white
                      transition-colors
                      hover:bg-[#8D623B]
                      sm:w-auto
                    "
                  >
                    Send another message

                    <ArrowRight size={16} />
                  </button>

                  <Link
                    to="/shop"
                    className="
                      inline-flex
                      min-h-[52px]
                      w-full
                      items-center
                      justify-center
                      gap-3
                      border
                      border-[#D7C8B6]
                      px-6
                      font-raleway
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.1em]
                      text-[#49392B]
                      transition-colors
                      hover:border-[#A67C52]
                      hover:bg-[#F5EDE2]
                      sm:w-auto
                    "
                  >
                    Explore DHMS

                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              /* ============================================== */
              /* CONTACT FORM                                   */
              /* ============================================== */

              <>
                {/* FORM INTRO */}

                <div className="mb-10">
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
                        w-7
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
                      Get in Touch
                    </span>
                  </div>

                  <h2
                    className="
                      font-serif
                      text-[clamp(2.3rem,4vw,3.8rem)]
                      font-normal
                      leading-[1.12]
                      tracking-[-0.045em]
                      text-[#29211C]
                    "
                  >
                    Tell us what's

                    <span
                      className="
                        mt-1
                        block
                        italic
                        text-[#A67C52]
                      "
                    >
                      on your mind.
                    </span>
                  </h2>

                  <p
                    className="
                      mt-5
                      max-w-lg
                      text-sm
                      leading-7
                      text-[#786D63]
                    "
                  >
                    Fill out the form below,
                    and we'll be happy to assist you.
                  </p>
                </div>

                {/* ========================================== */}
                {/* FORM                                       */}
                {/* ========================================== */}

                <form
                  ref={formRef}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="space-y-7"
                >
                  {/* ---------------------------------------- */}
                  {/* NAME AND EMAIL                           */}
                  {/* ---------------------------------------- */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-6
                      sm:grid-cols-2
                    "
                  >
                    {/* FULL NAME */}

                    <div className="min-w-0">
                      <label
                        htmlFor="dhms-contact-name"
                        className="
                          mb-3
                          block
                          font-raleway
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.13em]
                          text-[#49392B]
                        "
                      >
                        Full Name

                        <span className="ml-1 text-[#A67C52]">
                          *
                        </span>
                      </label>

                      <input
                        id="dhms-contact-name"
                        type="text"
                        placeholder="Your full name"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={
                          errors.name
                            ? "dhms-name-error"
                            : undefined
                        }
                        {...register("name", {
                          required:
                            "Please enter your name.",
                          maxLength: {
                            value: 100,
                            message:
                              "Name cannot exceed 100 characters.",
                          },
                        })}
                        className="
                          h-[54px]
                          w-full
                          min-w-0
                          rounded-none
                          border
                          border-[#E2D8CB]
                          bg-[#FAF8F4]
                          px-4
                          font-play
                          text-sm
                          text-[#29211C]
                          outline-none
                          transition-all
                          duration-300
                          placeholder:text-[#A89B8D]
                          focus:border-[#A67C52]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#A67C52]/10
                        "
                      />

                      {errors.name && (
                        <p
                          id="dhms-name-error"
                          role="alert"
                          className="
                            mt-2
                            text-xs
                            text-[#B3483A]
                          "
                        >
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* EMAIL ADDRESS */}

                    <div className="min-w-0">
                      <label
                        htmlFor="dhms-contact-email"
                        className="
                          mb-3
                          block
                          font-raleway
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.13em]
                          text-[#49392B]
                        "
                      >
                        Email Address

                        <span className="ml-1 text-[#A67C52]">
                          *
                        </span>
                      </label>

                      <input
                        id="dhms-contact-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        inputMode="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email
                            ? "dhms-email-error"
                            : undefined
                        }
                        {...register("email", {
                          required:
                            "Please enter your email address.",
                          pattern: {
                            value:
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message:
                              "Please enter a valid email address.",
                          },
                        })}
                        className="
                          h-[54px]
                          w-full
                          min-w-0
                          rounded-none
                          border
                          border-[#E2D8CB]
                          bg-[#FAF8F4]
                          px-4
                          font-play
                          text-sm
                          text-[#29211C]
                          outline-none
                          transition-all
                          duration-300
                          placeholder:text-[#A89B8D]
                          focus:border-[#A67C52]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#A67C52]/10
                        "
                      />

                      {errors.email && (
                        <p
                          id="dhms-email-error"
                          role="alert"
                          className="
                            mt-2
                            text-xs
                            text-[#B3483A]
                          "
                        >
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ---------------------------------------- */}
                  {/* SUBJECT                                  */}
                  {/* ---------------------------------------- */}

                  <div>
                    <label
                      htmlFor="dhms-contact-subject"
                      className="
                        mb-3
                        block
                        font-raleway
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.13em]
                        text-[#49392B]
                      "
                    >
                      How can we help?
                    </label>

                    <div className="relative">
                      <select
                        id="dhms-contact-subject"
                        defaultValue=""
                        {...register("subject")}
                        className="
                          h-[54px]
                          w-full
                          min-w-0
                          appearance-none
                          rounded-none
                          border
                          border-[#E2D8CB]
                          bg-[#FAF8F4]
                          pl-4
                          pr-12
                          font-play
                          text-sm
                          text-[#49392B]
                          outline-none
                          transition-all
                          duration-300
                          focus:border-[#A67C52]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#A67C52]/10
                        "
                      >
                        <option value="">
                          Select a subject (optional)
                        </option>

                        {subjectOptions.map(
                          (subject) => (
                            <option
                              key={subject}
                              value={subject}
                            >
                              {subject}
                            </option>
                          )
                        )}
                      </select>

                      <ChevronDown
                        size={18}
                        aria-hidden="true"
                        className="
                          pointer-events-none
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-[#A67C52]
                        "
                      />
                    </div>
                  </div>

                  {/* ---------------------------------------- */}
                  {/* MESSAGE                                  */}
                  {/* ---------------------------------------- */}

                  <div>
                    <label
                      htmlFor="dhms-contact-message"
                      className="
                        mb-3
                        block
                        font-raleway
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.13em]
                        text-[#49392B]
                      "
                    >
                      Your Message

                      <span className="ml-1 text-[#A67C52]">
                        *
                      </span>
                    </label>

                    <textarea
                      id="dhms-contact-message"
                      rows={6}
                      placeholder="Tell us how we can help you..."
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message
                          ? "dhms-message-error"
                          : undefined
                      }
                      {...register("message", {
                        required:
                          "Please enter your message.",
                        minLength: {
                          value: 10,
                          message:
                            "Please enter at least 10 characters.",
                        },
                        maxLength: {
                          value: 2000,
                          message:
                            "Message cannot exceed 2,000 characters.",
                        },
                      })}
                      className="
                        min-h-[170px]
                        w-full
                        min-w-0
                        resize-y
                        rounded-none
                        border
                        border-[#E2D8CB]
                        bg-[#FAF8F4]
                        px-4
                        py-4
                        font-play
                        text-sm
                        leading-7
                        text-[#29211C]
                        outline-none
                        transition-all
                        duration-300
                        placeholder:text-[#A89B8D]
                        focus:border-[#A67C52]
                        focus:bg-white
                        focus:ring-2
                        focus:ring-[#A67C52]/10
                      "
                    />

                    {errors.message && (
                      <p
                        id="dhms-message-error"
                        role="alert"
                        className="
                          mt-2
                          text-xs
                          text-[#B3483A]
                        "
                      >
                        {errors.message?.message}
                      </p>
                    )}
                  </div>

                  {/* ---------------------------------------- */}
                  {/* FORM FOOTER                              */}
                  {/* ---------------------------------------- */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-5
                      border-t
                      border-[#E7DED3]
                      pt-6
                    "
                  >
                    <p
                      className="
                        max-w-md
                        font-play
                        text-xs
                        leading-6
                        text-[#938679]
                      "
                    >
                      Your information will be used
                      to respond to your inquiry.
                      Please avoid including payment
                      details or other sensitive
                      information in your message.
                    </p>

                    {/* SUBMIT BUTTON */}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="
                        group
                        flex
                        min-h-[56px]
                        w-full
                        cursor-pointer
                        items-center
                        justify-between
                        gap-4
                        bg-[#29211C]
                        px-6
                        py-4
                        font-raleway
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-white
                        transition-all
                        duration-300
                        hover:bg-[#8D623B]
                        active:scale-[0.99]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        sm:px-7
                      "
                    >
                      <span
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >
                        {isSubmitting ? (
                          <span
                            aria-hidden="true"
                            className="
                              h-4
                              w-4
                              animate-spin
                              rounded-full
                              border-2
                              border-white/25
                              border-t-white
                            "
                          />
                        ) : (
                          <Send
                            size={17}
                            strokeWidth={1.6}
                          />
                        )}

                        {isSubmitting
                          ? "Sending your message..."
                          : "Send Message"}
                      </span>

                      <ArrowRight
                        size={18}
                        className="
                          shrink-0
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </button>
                  </div>
                </form>

                {/* BOTTOM FORM DETAIL */}

                <div
                  className="
                    mt-10
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                    border-t
                    border-[#E7DED3]
                    pt-6
                  "
                >
                  <span
                    className="
                      font-raleway
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-[#9B724B]
                    "
                  >
                    DHMS International
                  </span>

                  <span
                    className="
                      font-play
                      text-xs
                      italic
                      text-[#A89B8D]
                    "
                  >
                    We're happy to help.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* BOTTOM SHOPPING CTA                                */}
      {/* ================================================== */}

      <section
        className="
          border-t
          border-[#E4DACE]
          bg-[#EDE5DA]
          px-5
          py-12
          sm:px-8
          sm:py-14
          lg:px-12
          lg:py-16
        "
      >
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[1450px]
            flex-col
            gap-7
            md:flex-row
            md:items-center
            md:justify-between
            md:gap-12
          "
        >
          <div className="max-w-xl">
            <p
              className="
                mb-3
                font-raleway
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#9B724B]
              "
            >
              Discover DHMS
            </p>

            <h2
              className="
                font-serif
                text-[clamp(1.8rem,3vw,2.8rem)]
                font-normal
                leading-tight
                tracking-[-0.04em]
                text-[#29211C]
              "
            >
              A little something

              <span
                className="
                  ml-2
                  italic
                  text-[#9B724B]
                "
              >
                just for you.
              </span>
            </h2>
          </div>

          <Link
            to="/shop"
            className="
              group
              inline-flex
              min-h-[54px]
              w-full
              shrink-0
              items-center
              justify-between
              gap-6
              bg-[#29211C]
              px-6
              py-4
              font-raleway
              text-xs
              font-bold
              uppercase
              tracking-[0.1em]
              text-white
              transition-colors
              hover:bg-[#8D623B]
              sm:w-fit
            "
          >
            <span
              className="flex items-center gap-3"
            >
              <ShoppingBag size={17} />

              Explore Our Collection
            </span>

            <ArrowUpRight
              size={17}
              className="
                transition-transform
                duration-300
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Contact;