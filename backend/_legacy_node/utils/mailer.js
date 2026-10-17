// utils/mailer.js
// Brevo (Sendinblue) transactional email client.
// Uses the native fetch available in Node 18+ to call the Brevo REST API
// directly, so no SDK dependency is required.
//
// Required env vars:
//   BREVO_API_KEY        - API key from Brevo (SMTP & API > API Keys)
//   BREVO_SENDER_EMAIL   - Verified sender address on your Brevo account
//   BREVO_SENDER_NAME    - Display name used in the From header
//   ADMIN_EMAIL          - Address that receives order notifications

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export const ADMIN = process.env.ADMIN_EMAIL || "";

function getSender() {
  const email = process.env.BREVO_SENDER_EMAIL;
  const name = process.env.BREVO_SENDER_NAME || "DHMS International";

  if (!email) {
    throw new Error(
      "BREVO_SENDER_EMAIL is not configured."
    );
  }

  return { email, name };
}

function getApiKey() {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey || apiKey === "your_brevo_api_key") {
    throw new Error(
      "BREVO_API_KEY is missing or still set to the placeholder value."
    );
  }

  return apiKey;
}

/**
 * Send a transactional email through Brevo.
 *
 * @param {Object}   options
 * @param {string}   options.to          Recipient email (required).
 * @param {string}   [options.toName]    Recipient display name.
 * @param {string}   options.subject     Email subject (required).
 * @param {string}   options.html        HTML body (required).
 * @param {string}   [options.text]      Plain-text fallback body.
 * @param {string|{email:string,name?:string}} [options.replyTo]
 *        Reply-to address. Defaults to BREVO_SENDER_EMAIL.
 * @param {string[]} [options.tags]      Optional Brevo tags for reporting.
 * @param {Object}   [options.headers]   Extra SMTP headers (e.g. idempotency).
 * @returns {Promise<string|undefined>}  Brevo messageId on success.
 */
export async function sendOrderEmail({
  to,
  toName,
  subject,
  html,
  text,
  replyTo,
  tags,
  headers,
}) {
  if (!to) {
    throw new Error("Email recipient is missing.");
  }

  if (!subject) {
    throw new Error("Email subject is missing.");
  }

  if (!html) {
    throw new Error("Email HTML body is missing.");
  }

  const apiKey = getApiKey();
  const sender = getSender();

  const payload = {
    sender,
    to: [{ email: to, name: toName || to }],
    subject,
    htmlContent: html,
  };

  if (text) {
    payload.textContent = text;
  }

  if (replyTo) {
    payload.replyTo =
      typeof replyTo === "string"
        ? { email: replyTo }
        : replyTo;
  } else {
    payload.replyTo = { email: sender.email, name: sender.name };
  }

  if (Array.isArray(tags) && tags.length) {
    payload.tags = tags;
  }

  if (headers && typeof headers === "object") {
    payload.headers = headers;
  }

  console.log("BREVO: Sending email", { to, subject });

  let response;
  try {
    response = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    console.error("BREVO NETWORK ERROR:", networkError.message);
    throw new Error(
      `Brevo request failed: ${networkError.message}`
    );
  }

  const raw = await response.text();
  let data = null;

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      // Non-JSON body; keep raw text for the error path.
    }
  }

  if (!response.ok) {
    const detail =
      (data && (data.message || data.code)) ||
      raw ||
      `HTTP ${response.status}`;

    console.error("BREVO ERROR:", detail);

    throw new Error(`Brevo failed to send email: ${detail}`);
  }

  const messageId = data?.messageId;

  console.log("BREVO EMAIL ACCEPTED:", messageId);

  return messageId;
}
