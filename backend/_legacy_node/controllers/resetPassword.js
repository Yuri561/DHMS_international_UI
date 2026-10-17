// controllers/resetPassword.js
// Password-reset request handler.
// Emails the reset link to the user via Brevo instead of
// returning it in the HTTP response.

import User from "../models/User.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

import { sendOrderEmail } from "../utils/mailer.js";
import {
  passwordResetHTML,
  passwordResetText,
} from "../utils/emailTemplate.js";

config();

const jwtKey = process.env.JWT_KEY;

// Generic response used for both "user exists" and
// "user does not exist" to avoid leaking account existence.
const GENERIC_RESPONSE = {
  message:
    "If an account exists for that email, a password reset link has been sent.",
};

export const resetPassword = async (req, res) => {
  console.log("/reset-password-request route was hit");

  try {
    const userEmail = req.body?.email;

    if (!userEmail) {
      // Still return a generic message; do not reveal that
      // the email was missing.
      return res.status(200).json(GENERIC_RESPONSE);
    }

    const foundUser = await User.findOne({ email: userEmail });

    if (!foundUser) {
      // Account does not exist. Do not reveal that; just
      // return the same generic acknowledgement.
      return res.status(200).json(GENERIC_RESPONSE);
    }

    const payload = {
      sub: foundUser._id,
      email: userEmail,
      iat: Math.floor(Date.now() / 1000),
      purpose: "reset-password",
      exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 min
    };

    const token = jwt.sign(payload, jwtKey);

    const baseLink = (process.env.RESET_LINK || "").replace(/\/+$/, "");
    const resetLink = `${baseLink}?token=${encodeURIComponent(token)}`;

    try {
      await sendOrderEmail({
        to: userEmail,
        toName: foundUser.username || foundUser.name || userEmail,
        subject: "Reset your DHMS International password",
        html: passwordResetHTML({
          name: foundUser.username || foundUser.name,
          link: resetLink,
        }),
        text: passwordResetText({
          name: foundUser.username || foundUser.name,
          link: resetLink,
        }),
        tags: ["password-reset"],
      });
    } catch (mailError) {
      console.error(
        "Failed to send password reset email:",
        mailError.message
      );

      return res.status(500).json({
        message:
          "We could not send the reset email at this time. Please try again shortly.",
      });
    }

    return res.status(200).json(GENERIC_RESPONSE);
  } catch (err) {
    console.error("Password reset error:", err);
    return res.status(500).json({
      message: "Unable to process reset request, server error.",
      error: err.message,
    });
  }
};
