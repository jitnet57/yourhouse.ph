"""Route package for K-IREA API."""

from .health import router as health_router
from .auth import router as auth_router
from .properties import router as properties_router
from .leads import router as leads_router
from .users import router as users_router
from .agents import router as agents_router
from .reports import router as reports_router
from .integrations import router as integrations_router

__all__ = [
    "health_router",
    "auth_router",
    "properties_router",
    "leads_router",
    "users_router",
    "agents_router",
    "reports_router",
    "integrations_router",
]
