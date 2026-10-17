"""
Dev launcher. Equivalent to the old `nodemon server.js`.

Usage:
    python run.py
    # or
    uvicorn app.main:app --reload --port 8080
"""

from __future__ import annotations

import uvicorn

from app.config import settings


def main() -> None:
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=not settings.is_prod,
        log_level="info",
    )


if __name__ == "__main__":
    main()
