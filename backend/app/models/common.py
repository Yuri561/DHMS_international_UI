"""
Shared conversion helpers used across models/routes.
Keeps Mongo-specific types out of the HTTP response layer.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from bson import ObjectId


def _coerce_value(value: Any) -> Any:
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, datetime):
        # Serialize as ISO-8601 UTC so the frontend's `new Date(...)` works.
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
    if isinstance(value, dict):
        return {k: _coerce_value(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_coerce_value(v) for v in value]
    return value


def serialize_doc(doc: dict[str, Any] | None) -> dict[str, Any] | None:
    """Convert a Mongo document into a JSON-safe dict.

    - `_id` is stringified.
    - Nested ObjectIds and datetimes are recursively coerced.
    """
    if doc is None:
        return None

    return {k: _coerce_value(v) for k, v in doc.items()}


def utcnow() -> datetime:
    """Timezone-aware UTC now."""
    return datetime.now(tz=timezone.utc)
