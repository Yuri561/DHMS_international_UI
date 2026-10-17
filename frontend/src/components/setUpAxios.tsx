import axios from "axios";

// ------------------------------------------------------------
// Shared axios instance for DHMS International
// ------------------------------------------------------------
//
// All browser-originated API calls (checkout, cart, auth,
// dashboard, etc.) should route through this instance so that:
//
//   • baseURL is configurable via `VITE_API_URL`
//   • cookies (session + cartId) are sent cross-origin
//     thanks to `withCredentials: true`
//
// Backend secrets must never live here — only the public API
// base URL belongs on the client.

const rawBaseUrl = import.meta.env.VITE_API_URL as string | undefined;

// Strip any trailing slash so request paths can safely start
// with `/`, e.g. `api.post("/checkout/create-checkout-session")`.
const baseURL = (rawBaseUrl ?? "").replace(/\/+$/, "");

if (!baseURL && import.meta.env.DEV) {
  // Surface misconfiguration early in development only. In
  // production builds this stays silent to avoid leaking
  // internals via the console.
  // eslint-disable-next-line no-console
  console.warn(
    "[DHMS] VITE_API_URL is not set. API requests will fail. " +
      "Add VITE_API_URL to your .env file."
  );
}

const api = axios.create({
  baseURL,
  withCredentials: true, // sends session + cartId cookies
});

export default api;
