"""
FastAPI entry point for DHMS International.

Wires:
  - CORS (same origin allowlist the Node backend used)
  - Signed-cookie session (replaces express-session + MongoStore)
  - All routers (products, cart, checkout, webhook, auth, reset,
    favorites, orders)
  - Mongo lifecycle hooks
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from starlette.middleware.sessions import SessionMiddleware

from .config import settings
from .database import close_mongo_connection, connect_to_mongo
from .routes.auth import google_router, root_router as auth_router
from .routes.cart import router as cart_router
from .routes.checkout import router as checkout_router
from .routes.favorites import router as favorites_router
from .routes.orders import router as orders_router
from .routes.password_reset import router as password_reset_router
from .routes.products import router as products_router
from .routes.webhook import router as webhook_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("dhms")


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    settings.ensure_startup_ready()
    await connect_to_mongo()
    try:
        yield
    finally:
        await close_mongo_connection()


app = FastAPI(
    title="DHMS International API",
    version="1.0.0",
    lifespan=lifespan,
)


# ------------------------------------------------------------------
# CORS
#
# Matches backend/_legacy_node/server.js — exact allowlist, allow
# credentials, same methods and headers.
# ------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
    ],
)


# ------------------------------------------------------------------
# Session (signed cookie)
#
# Starlette's SessionMiddleware signs an itsdangerous cookie with
# SESSION_SECRET. We only put userId/username/role in the session,
# which fits comfortably under the 4KB cookie limit.
#
# Cross-site cookie attributes mirror express-session's config:
#   - secure + SameSite=none in production
#   - lax in development
# ------------------------------------------------------------------

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.session_secret,
    session_cookie="session",
    max_age=60 * 60,  # 1 hour, matches Node session cookie maxAge
    same_site="none" if settings.is_prod else "lax",
    https_only=settings.is_prod,
)


# ------------------------------------------------------------------
# Routers
# ------------------------------------------------------------------

app.include_router(products_router)
app.include_router(cart_router)
app.include_router(checkout_router)
app.include_router(webhook_router)
app.include_router(auth_router)          # /register, /login, /logout, /me, /update-password
app.include_router(google_router)        # /auth/google
app.include_router(password_reset_router)  # /reset-password-request, /reset-password
app.include_router(favorites_router)
app.include_router(orders_router)


# ------------------------------------------------------------------
# Liveness
# ------------------------------------------------------------------


@app.get("/", response_class=PlainTextResponse)
async def root() -> str:
    return "We are live"


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}
