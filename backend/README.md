# DHMS International — Python backend

FastAPI port of the original Express/Mongoose backend. Same
MongoDB collections, same Brevo email flow, same Stripe webhook
contract, same cookie semantics.

The original Node source is preserved under `_legacy_node/` for
reference.

## Stack

- **FastAPI** + **Uvicorn** — HTTP layer
- **Motor** — async MongoDB driver (reads the existing Mongoose
  collections untouched)
- **Starlette SessionMiddleware** — signed-cookie session that
  replaces `express-session` + `connect-mongo` for the small set
  of fields we actually store (`userId`, `username`, `role`)
- **Stripe (Python SDK)** — Checkout Sessions + webhook signature
  verification
- **Brevo REST API via httpx** — transactional email
- **bcrypt** + **PyJWT** — password hashing and reset tokens, using
  the same algorithms the Node code used (`bcrypt` 10-round hashes,
  HS256 JWTs with the same payload shape)

## Quick start

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Make sure .env is populated (see .env.example)
python run.py
```

The API listens on `http://localhost:8080` by default. The
frontend's `.env` already points there (`VITE_API_URL=http://localhost:8080`).

## Endpoints

| Method | Path | Purpose | Auth |
|-------:|------|---------|-----:|
| GET | `/` | Liveness | — |
| GET | `/healthz` | Health check | — |
| GET | `/products` | List products | — |
| POST | `/products` | Bulk upsert (seed script) | — |
| GET | `/cart` | Return current cart items | cart cookie |
| POST | `/cart/add` | Add or increment an item | cart cookie |
| PATCH | `/cart/update/{id}` | Set an item's quantity | cart cookie |
| DELETE | `/cart/remove/{id}` | Remove an item | cart cookie |
| DELETE | `/cart/clear` | Empty the cart | cart cookie |
| POST | `/checkout/create-checkout-session` | Build a Stripe Checkout Session | cart cookie |
| POST | `/checkout/webhook/stripe` | Stripe webhook (raw body + signature) | signature |
| POST | `/register` | Create user, start session | — |
| POST | `/login` | Verify credentials, start session | — |
| GET \| POST | `/logout` | Destroy session | — |
| GET | `/me` | Current signed-in user | session |
| POST | `/update-password` | Change password | session |
| POST | `/auth/google` | Google ID token sign-in | — |
| POST | `/reset-password-request` | Email a reset link | — |
| POST | `/reset-password` | Consume token, set new password | — |
| GET | `/favorites` | List current user's favorites | session |
| POST | `/favorites` | Add a favorite | session |
| DELETE | `/favorites/{id}` | Remove a favorite | session |
| GET | `/orders` | Order history for the current user | session |

OpenAPI docs are live at `http://localhost:8080/docs` while the
server is running.

## Session cookie

Signed via `SESSION_SECRET`. In production (`NODE_ENV=production`)
the cookie uses `SameSite=None; Secure` so the Vercel frontend
can carry it cross-origin. In dev it falls back to `SameSite=Lax`.

A separate `cartId` cookie is minted by `ensure_cart_id` for cart
routes, matching the Node `ensureCartId` middleware.

## Stripe webhook

Point your Stripe webhook endpoint at:

```
POST https://<your-api-host>/checkout/webhook/stripe
```

Signature verification uses the raw request body, so make sure no
upstream proxy mutates the payload. Idempotency is keyed on
`stripeSessionId`.

## Env

See `.env.example` for the full list. The Python backend reads the
same keys the Node backend did, so a working legacy `.env` can be
reused as-is. `MONGODB_DB_NAME` is an optional override — by
default the database name is parsed out of the `MONGODB_URI` path.
