"""Redis client for translation caching."""
import os
import json
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Try to import real redis; fall back to in-memory stub for dev
try:
    import redis.asyncio as aioredis
    _REDIS_AVAILABLE = True
except ImportError:
    _REDIS_AVAILABLE = False
    logger.warning("redis package not installed — using in-memory cache stub")


class _InMemoryCache:
    """Minimal in-memory cache used when Redis is unavailable."""
    def __init__(self):
        self._store: dict = {}

    async def get(self, key: str) -> Optional[str]:
        return self._store.get(key)

    async def setex(self, key: str, ttl: int, value: str) -> None:
        self._store[key] = value  # TTL ignored in stub

    async def delete(self, key: str) -> None:
        self._store.pop(key, None)

    async def flushdb(self) -> None:
        self._store.clear()

    async def ping(self) -> bool:
        return True


_client: Optional[object] = None


async def get_redis():
    """Return singleton Redis (or stub) client."""
    global _client
    if _client is not None:
        return _client

    redis_url = os.getenv("REDIS_URL", "")
    if _REDIS_AVAILABLE and redis_url:
        try:
            _client = aioredis.from_url(redis_url, decode_responses=True)
            await _client.ping()
            logger.info("✅ Redis connected: %s", redis_url)
        except Exception as e:
            logger.warning("Redis connection failed (%s) — using in-memory cache", e)
            _client = _InMemoryCache()
    else:
        _client = _InMemoryCache()

    return _client


# ── Typed helpers ──────────────────────────────────────────────────────────

TRANSLATION_TTL = 86_400  # 24 hours


def _cache_key(lang: str, content_key: str) -> str:
    return f"trans:{lang}:{content_key}"


async def cache_get_translation(lang: str, content_key: str) -> Optional[str]:
    r = await get_redis()
    return await r.get(_cache_key(lang, content_key))


async def cache_set_translation(lang: str, content_key: str, text: str) -> None:
    r = await get_redis()
    await r.setex(_cache_key(lang, content_key), TRANSLATION_TTL, text)


async def cache_invalidate(lang: str, content_key: str) -> None:
    r = await get_redis()
    await r.delete(_cache_key(lang, content_key))
