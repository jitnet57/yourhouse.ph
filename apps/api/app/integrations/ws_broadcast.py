"""WebSocket broadcast stub using an in-process pub/sub.
Replace with Redis Pub/Sub or a proper WS gateway in production."""
from __future__ import annotations

import asyncio
import logging
from collections import defaultdict
from typing import Any

logger = logging.getLogger(__name__)

# channel → list[asyncio.Queue]
_subscribers: dict[str, list[asyncio.Queue]] = defaultdict(list)


async def broadcast(channel: str, payload: dict[str, Any]) -> None:
    """Push a JSON-serializable payload to all subscribers of a channel."""
    queues = list(_subscribers.get(channel, []))
    logger.debug("[ws] broadcast %s → %d subscribers", channel, len(queues))
    for q in queues:
        try:
            q.put_nowait(payload)
        except asyncio.QueueFull:
            logger.warning("[ws] queue full, dropping message on channel=%s", channel)


def subscribe(channel: str) -> asyncio.Queue:
    q: asyncio.Queue = asyncio.Queue(maxsize=100)
    _subscribers[channel].append(q)
    return q


def unsubscribe(channel: str, q: asyncio.Queue) -> None:
    if channel in _subscribers and q in _subscribers[channel]:
        _subscribers[channel].remove(q)
