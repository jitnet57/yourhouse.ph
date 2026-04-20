"""
Cloudflare Access JWT verification.

In production, every request to the API passes through CF Access,
which attaches a signed JWT in the CF-Access-Jwt-Assertion header.
This module verifies that JWT and extracts the caller's email.

Local dev: set CF_ACCESS_TEAM_DOMAIN="" (empty) to skip verification.
"""

import os
import httpx
from functools import lru_cache
from fastapi import Header, HTTPException, status
from jose import jwt, JWTError

CF_ACCESS_TEAM_DOMAIN = os.getenv("CF_ACCESS_TEAM_DOMAIN", "")
CF_ACCESS_AUD = os.getenv("CF_ACCESS_AUD", "")


@lru_cache(maxsize=1)
def _get_public_keys() -> list[dict]:
    url = f"https://{CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs"
    resp = httpx.get(url, timeout=5)
    resp.raise_for_status()
    return resp.json()["keys"]


def verify_cf_access(
    cf_access_jwt_assertion: str | None = Header(default=None, alias="CF-Access-Jwt-Assertion"),
) -> dict:
    """
    FastAPI dependency — returns CF Access JWT claims if valid.
    Skip verification when CF_ACCESS_TEAM_DOMAIN is not configured (local dev).
    """
    if not CF_ACCESS_TEAM_DOMAIN:
        # Local dev: return a mock identity
        return {"email": "dev@yourhouse.ph", "sub": "dev"}

    if not cf_access_jwt_assertion:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing CF Access token")

    try:
        keys = _get_public_keys()
        claims = jwt.decode(
            cf_access_jwt_assertion,
            keys,
            algorithms=["RS256"],
            audience=CF_ACCESS_AUD or None,
        )
        return claims
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid CF Access token: {exc}")
