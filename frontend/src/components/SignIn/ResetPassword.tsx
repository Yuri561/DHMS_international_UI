import React, { useState } from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

import { applyPasswordReset } from "../AuthFolder/AuthFiles";

// ============================================================
// DHMS INTERNATIONAL
// RESET PASSWORD — TOKEN CONSUME PAGE
// ============================================================
//
// Users land here from the password-reset email link, which
// contains a signed `token` query param. The frontend reads
// the token, collects a new password, and POSTs both to the
// backend. The token is never read from an API response.

type ViewState =
  | "form"
  | "success"
  | "invalid-token"
  | "missing-token";

const PASSWORD_MIN_LENGTH = 8;

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const [view, setView] = useState<ViewState>(
    token ? "form" : "missing-token"
  );

  // ----------------------------------------------------------
  // SUBMIT HANDLER
  // ----------------------------------------------------------

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError(null);

    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
      );

      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");

      return;
    }

    setSubmitting(true);

    try {
      await applyPasswordReset(token, password);

      setView("success");
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 400 || status === 401 || status === 410) {
        setView("invalid-token");
      } else {
        setError(
          err?.response?.data?.message ||
            "We could not update your password at this time. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main
      id="reset-password"
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

      <section
        className="
          relative
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-xl
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

        <div className="mb-8 flex items-center gap-3">
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
        </div>

        {/* ============================================= */}
        {/* CARD                                          */}
        {/* ============================================= */}

        <div
          className="
            relative
            w-full
            overflow-hidden
            bg-white
            shadow-[0_25px_90px_rgba(41,33,28,0.07)]
          "
        >
          <div className="h-[3px] w-full bg-[#A67C52]" />

          <div
            className="
              flex
              flex-col
              px-5
              pb-12
              pt-12
              sm:px-10
              sm:pb-14
              sm:pt-14
            "
          >
            {/* ========================================== */}
            {/* VIEW: MISSING TOKEN                        */}
            {/* ========================================== */}

            {view === "missing-token" && (
              <>
                <div
                  className="
                    mb-7
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#E5DBCF]
                    bg-[#FFF3E8]
                    text-[#A67C52]
                  "
                >
                  <AlertCircle
                    size={28}
                    strokeWidth={1.6}
                  />
                </div>

                <h1
                  className="
                    font-raleway
                    text-3xl
                    font-semibold
                    leading-tight
                    tracking-[-0.03em]
                    text-[#29211C]
                    sm:text-4xl
                  "
                >
                  No reset token found
                </h1>

                <p
                  className="
                    mt-5
                    text-sm
                    leading-7
                    text-[#786D63]
                  "
                >
                  Please open the password-reset link from
                  your email. If the link looks incomplete,
                  request a new one from the sign-in page.
                </p>

                <Link
                  to="/signin"
                  className="
                    mt-8
                    inline-flex
                    min-h-[52px]
                    items-center
                    justify-center
                    gap-3
                    bg-[#29211C]
                    px-6
                    py-3
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
                  Back to Sign In
                  <ArrowRight size={16} />
                </Link>
              </>
            )}

            {/* ========================================== */}
            {/* VIEW: INVALID / EXPIRED TOKEN              */}
            {/* ========================================== */}

            {view === "invalid-token" && (
              <>
                <div
                  className="
                    mb-7
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#E5DBCF]
                    bg-[#FFF3E8]
                    text-[#A67C52]
                  "
                >
                  <AlertCircle
                    size={28}
                    strokeWidth={1.6}
                  />
                </div>

                <h1
                  className="
                    font-raleway
                    text-3xl
                    font-semibold
                    leading-tight
                    tracking-[-0.03em]
                    text-[#29211C]
                    sm:text-4xl
                  "
                >
                  This link is no longer valid
                </h1>

                <p
                  className="
                    mt-5
                    text-sm
                    leading-7
                    text-[#786D63]
                  "
                >
                  This link has expired or is no longer
                  valid. Request a new one from the sign-in
                  page.
                </p>

                <Link
                  to="/signin"
                  className="
                    mt-8
                    inline-flex
                    min-h-[52px]
                    items-center
                    justify-center
                    gap-3
                    bg-[#29211C]
                    px-6
                    py-3
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
                  Request a new link
                  <ArrowRight size={16} />
                </Link>
              </>
            )}

            {/* ========================================== */}
            {/* VIEW: SUCCESS                              */}
            {/* ========================================== */}

            {view === "success" && (
              <>
                <div
                  className="
                    mb-7
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D7B791]
                    bg-[#F5EDE2]
                    text-[#29211C]
                  "
                >
                  <Check
                    size={28}
                    strokeWidth={1.8}
                  />
                </div>

                <h1
                  className="
                    font-raleway
                    text-3xl
                    font-semibold
                    leading-tight
                    tracking-[-0.03em]
                    text-[#29211C]
                    sm:text-4xl
                  "
                >
                  Password updated
                </h1>

                <p
                  className="
                    mt-5
                    text-sm
                    leading-7
                    text-[#786D63]
                  "
                >
                  Your password has been updated. You can
                  now sign in with your new password.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/signin")}
                  className="
                    group
                    mt-8
                    inline-flex
                    min-h-[52px]
                    items-center
                    justify-center
                    gap-3
                    bg-[#29211C]
                    px-6
                    py-3
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
                  Go to Sign In
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </>
            )}

            {/* ========================================== */}
            {/* VIEW: FORM                                 */}
            {/* ========================================== */}

            {view === "form" && (
              <>
                <div
                  className="
                    mb-7
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D7B791]
                    bg-[#F5EDE2]
                    text-[#A67C52]
                  "
                >
                  <Lock size={26} strokeWidth={1.6} />
                </div>

                <p
                  className="
                    mb-4
                    font-raleway
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-[#A67C52]
                  "
                >
                  Reset Password
                </p>

                <h1
                  className="
                    font-raleway
                    text-3xl
                    font-semibold
                    leading-tight
                    tracking-[-0.03em]
                    text-[#29211C]
                    sm:text-4xl
                  "
                >
                  Choose a new password
                </h1>

                <p
                  className="
                    mt-4
                    text-sm
                    leading-7
                    text-[#786D63]
                  "
                >
                  Use at least {PASSWORD_MIN_LENGTH}{" "}
                  characters. Mix letters, numbers, and
                  symbols for extra strength.
                </p>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-8 space-y-5"
                >
                  <div>
                    <label
                      htmlFor="new-password"
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
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        id="new-password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        autoComplete="new-password"
                        className="
                          h-[54px]
                          w-full
                          rounded-none
                          border
                          border-[#E2D8CB]
                          bg-[#FAF8F4]
                          px-4
                          pr-12
                          font-play
                          text-sm
                          text-[#29211C]
                          outline-none
                          transition-all
                          placeholder:text-[#A89B8D]
                          focus:border-[#A67C52]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#A67C52]/10
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((v) => !v)
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          text-[#A89B8D]
                          transition-colors
                          hover:text-[#49392B]
                        "
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
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
                      Confirm Password
                    </label>

                    <input
                      id="confirm-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      autoComplete="new-password"
                      className="
                        h-[54px]
                        w-full
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
                        placeholder:text-[#A89B8D]
                        focus:border-[#A67C52]
                        focus:bg-white
                        focus:ring-2
                        focus:ring-[#A67C52]/10
                      "
                    />
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="
                        flex
                        items-start
                        gap-2
                        font-play
                        text-xs
                        leading-6
                        text-[#B3483A]
                      "
                    >
                      <AlertCircle
                        size={14}
                        className="mt-0.5 shrink-0"
                      />
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="
                      group
                      mt-4
                      inline-flex
                      min-h-[56px]
                      w-full
                      items-center
                      justify-center
                      gap-3
                      bg-[#29211C]
                      px-6
                      py-3
                      font-raleway
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.1em]
                      text-white
                      transition-colors
                      hover:bg-[#8D623B]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {submitting ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/30
                            border-t-white
                          "
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        Update Password
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;
