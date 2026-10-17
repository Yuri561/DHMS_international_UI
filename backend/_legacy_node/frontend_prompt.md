# Frontend Configuration Prompt — DHMS International

Give this prompt to the frontend coding agent along with access to the DHMS frontend repository. It describes everything the frontend must do so it aligns with the backend's new Brevo-based email flow and the updated purchase / password-reset endpoints.

---

You are updating the DHMS International frontend so it works correctly with the DHMS backend. The backend now sends all transactional email through Brevo. All email (order confirmations, admin notifications, password-reset links) is sent server-side. The frontend must never attempt to send email directly.

## 1. Mail flow overview (context, do not implement on the frontend)

1. Customer completes checkout on Stripe.
2. Stripe redirects the browser to `https://dhmsint.com/success?session_id={CHECKOUT_SESSION_ID}` and fires a `checkout.session.completed` webhook to the backend.
3. The backend verifies the Stripe signature, persists the order, and sends two emails via Brevo:
   - A professional order confirmation to the **customer**.
   - An order notification to the **admin inbox** (`ADMIN_EMAIL`), with the customer's email set as `Reply-To`.
4. The success page the user lands on is purely informational — it does not need to call any backend endpoint to trigger emails.

The frontend's job is to collect clean checkout data, hand the user off to Stripe, show the right confirmation UI on return, and set correct user expectations about the email they will receive.

## 2. API contract

Base URL comes from a single env variable, for example:

```
VITE_API_BASE_URL=https://api.dhmsint.com
```

All API calls must go through this base URL — do not hardcode the host anywhere. All requests that touch the cart or session must include credentials so the `cartId` cookie is sent:

```js
fetch(`${import.meta.env.VITE_API_BASE_URL}/checkout/create-checkout-session`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

### 2.1 `POST /checkout/create-checkout-session`

Request body:

```json
{
  "email": "customer@example.com",
  "name": "Full customer name",
  "homeAddress": "123 Main St",
  "city": "City",
  "state": "ST",
  "zipCode": "12345",
  "line_items": [
    {
      "quantity": 1,
      "price_data": {
        "unit_amount": 2500,
        "product_data": { "name": "Product name" }
      }
    }
  ]
}
```

Rules the frontend must enforce before sending:

- `email` is the real customer email. The backend uses it to pre-fill the Stripe form and as the receipt recipient. Required.
- `unit_amount` is in **cents**, integer, >= 1.
- `quantity` is an integer, >= 1.
- Drop any invalid line items client-side; the backend will reject the request if every line item is invalid.
- Send cookies (`credentials: "include"`) so the `cartId` cookie reaches the backend.

Response:

```json
{ "url": "https://checkout.stripe.com/..." }
```

Redirect with `window.location.assign(url)`. Do not try to render the Stripe page inside an iframe.

Error response (non-2xx):

```json
{ "message": "No items to checkout" }
```

Surface the message to the user via a toast or inline error; do not log raw error objects to the console in production builds.

### 2.2 `POST /reset-password-request`

> Note: this endpoint is defined in `routes/resetPassRoute.js` but may not currently be mounted in `server.js`. Treat it as the shape to use once it is live. If the frontend hits a 404, show the same generic success message.

Request:

```json
{ "email": "user@example.com" }
```

Response (always 200 on normal operation, even if the email is unknown — this is intentional to avoid account enumeration):

```json
{
  "message": "If an account exists for that email, a password reset link has been sent."
}
```

Response (500) if the backend cannot send the email at all:

```json
{ "message": "We could not send the reset email at this time. Please try again shortly." }
```

The reset link itself is **no longer returned in the HTTP response** — it is emailed to the user. The frontend must not try to read a `link` field; the password-reset form submission simply triggers the email and then shows a confirmation message.

### 2.3 Password reset consume (`/reset-password?token=...`)

Users click the link from the email. The frontend receives the JWT via the `token` query param. Keep whatever route/handler already exists for applying the new password; just make sure the token is read from the URL, not from an API response.

## 3. Required pages / UI states

### 3.1 Success page: `GET /success?session_id=...`

Render a professional confirmation that tells the user:

- Their payment went through.
- A receipt was emailed to the address they used at checkout.
- A member of the DHMS team will contact them shortly to arrange next steps.
- If the receipt is not in their inbox within a few minutes, check the spam / promotions folder.

Suggested copy (adapt tone to the rest of the site):

> **Thank you for your order.**
>
> Your payment has been received. We have sent a confirmation to your email, and a member of our team will be in touch with you shortly to arrange the next steps.
>
> If you do not see the confirmation within a few minutes, please check your spam or promotions folder.

Include:

- A primary CTA such as **Back to home** or **Continue shopping** linking to `/`.
- A secondary link to a support email (`mailto:${ADMIN_EMAIL from env or similar}`) with subject `Order enquiry`.
- Optionally, display the Stripe `session_id` as a reference line in muted text. Do not display the raw object or any payment details.

Do **not** call any backend endpoint from this page to "send" the receipt — emails are already triggered by the Stripe webhook.

### 3.2 Cancel page: `GET /cart?canceled=1`

When the URL contains `canceled=1`, show a non-alarming notice at the top of the cart:

> **Checkout was canceled.** No payment has been taken. Your cart is still here if you'd like to review it or try again.

Then render the normal cart UI.

### 3.3 Checkout form

Near the email input, add microcopy:

> We'll send your order confirmation here.

Validate email format client-side before enabling the submit button. Pass the same email as both the `email` body field and (if you also instantiate Stripe client-side anywhere) the Stripe `customer_email`.

### 3.4 Password-reset request form

After a successful submit, always show:

> If an account exists for that email, we've sent you a password-reset link. The link expires in 15 minutes.

Do not reveal whether the account exists.

### 3.5 Password-reset confirmation page

- Read `token` from `?token=...`.
- On submit, POST the new password + token to whatever the existing reset-apply endpoint is.
- On success, show: "Your password has been updated. You can now sign in."
- On expired/invalid token, show: "This link has expired or is no longer valid. Request a new one." with a link back to the reset request page.

## 4. CORS

The backend allows these origins. The frontend must be served from one of them (plus whatever your dev proxy uses):

- `https://www.dhmsint.com`
- `https://dhmsint.com`
- `https://dhms-client.vercel.app`
- `http://localhost:5173`

Every API call needs `credentials: "include"` so session and `cartId` cookies work across origins.

## 5. Security — things the frontend must NOT do

- Do not install `resend`, `nodemailer`, `@getbrevo/brevo`, or any SMTP/email client in the frontend bundle. Email is backend-only.
- Do not call Brevo, Resend, SendGrid, or any mail provider directly from the browser.
- Do not expose the Stripe secret key, Brevo API key, Mongo URI, or any other backend secret in client code or env variables prefixed with `VITE_`/`NEXT_PUBLIC_`/`REACT_APP_`. The only Stripe key the frontend may ever hold is the publishable key (`pk_live_...` / `pk_test_...`). The current flow uses backend-created Checkout Sessions and a simple redirect, so no publishable key is required.
- Do not log full API response bodies in production.

## 6. Env variables for the frontend

Only the following are expected on the frontend. Everything else lives server-side.

```
VITE_API_BASE_URL=https://api.dhmsint.com
# optional:
VITE_SUPPORT_EMAIL=dhmsint@gmail.com
```

Add a `.env.example` committed to the frontend repo with these variables and sensible placeholders. Make sure the real `.env` is in `.gitignore`.

## 7. Deliverables

1. A configurable API base URL used by every request.
2. `credentials: "include"` on every API call.
3. Updated checkout submit flow sending the body shape in §2.1 and redirecting to the returned Stripe URL.
4. New / updated `/success` page per §3.1.
5. Cancel banner on `/cart` per §3.2.
6. Microcopy near the email input per §3.3.
7. Updated password-reset request + confirm flows per §3.4 and §3.5 (no reliance on the backend returning the reset link).
8. No new client-side mail dependencies.
9. `.env.example` and updated `.gitignore` in the frontend repo.

When finished, output:

- A short written summary of files touched.
- Any assumptions you made about existing component names/routes.
- Any backend behavior you could not verify from the contract above and would like clarified.
