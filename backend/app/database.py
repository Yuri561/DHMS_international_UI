"""
Mongo client wiring using Motor (async MongoDB driver).

Exposes:
  - `connect_to_mongo` / `close_mongo_connection` lifecycle hooks
  - `get_db` dependency that yields the active database handle
"""

from __future__ import annotations

import logging
from typing import Any
from urllib.parse import urlparse

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from .config import settings

logger = logging.getLogger("dhms.db")


class _MongoState:
    client: AsyncIOMotorClient | None = None
    database: AsyncIOMotorDatabase | None = None


_state = _MongoState()


def _resolve_db_name(uri: str) -> str:
    """Pull the database name out of the connection URI.

    Mongoose on the Node side used whatever was in the URI path
    (`.../dhmsDb?...`), so we preserve that convention. Fallback
    to MONGODB_DB_NAME if the URI path is empty.
    """
    if settings.mongodb_db_name:
        return settings.mongodb_db_name

    parsed = urlparse(uri)
    path = (parsed.path or "").lstrip("/")
    if path:
        return path

    return "dhmsDb"


async def connect_to_mongo() -> None:
    """Open the Mongo client and verify connectivity."""
    if _state.client is not None:
        return

    uri = settings.mongodb_uri
    if not uri:
        raise RuntimeError(
            "MONGODB_URI is not set. Cannot connect to MongoDB."
        )

    client = AsyncIOMotorClient(uri, uuidRepresentation="standard")

    # Trigger an initial round-trip so we fail fast at startup
    # instead of on first request.
    await client.admin.command("ping")

    db_name = _resolve_db_name(uri)
    _state.client = client
    _state.database = client[db_name]

    logger.info("MongoDB connected (database=%s)", db_name)


async def close_mongo_connection() -> None:
    if _state.client is not None:
        _state.client.close()
        _state.client = None
        _state.database = None
        logger.info("MongoDB connection closed")


def get_db() -> AsyncIOMotorDatabase:
    """FastAPI dependency returning the active database handle."""
    if _state.database is None:
        raise RuntimeError(
            "MongoDB has not been initialised yet. "
            "Did the startup event run?"
        )
    return _state.database


# Convenience accessor for background tasks / webhook paths that
# cannot inject dependencies via `Depends`.
def db() -> AsyncIOMotorDatabase:
    return get_db()


# Collection helpers — keep collection names in one place so the
# Python port stays byte-compatible with the data Mongoose wrote.
COLLECTIONS: dict[str, str] = {
    "users": "users",
    "products": "products",
    "carts": "carts",
    "orders": "orders",
    "favorites": "favorites",
}


def collection(name: str) -> Any:
    return get_db()[COLLECTIONS[name]]
