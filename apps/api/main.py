"""
K-IREA Platform - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from app.routes import health_router

# ============================================================================
# LIFESPAN MANAGEMENT
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup: Initialize connections to external services
    Shutdown: Clean up resources
    """
    # Startup
    logger.info("🚀 K-IREA Backend Starting...")
    logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    
    # Initialize Supabase connection
    from app.integrations.supabase_client import init_supabase
    await init_supabase()
    logger.info("✅ Supabase initialized")
    
    # Test Twilio connectivity
    from app.integrations.twilio_client import test_twilio_connection
    await test_twilio_connection()
    logger.info("✅ Twilio initialized")
    
    # Test ElevenLabs connectivity
    from app.integrations.elevenlabs_client import test_elevenlabs_connection
    await test_elevenlabs_connection()
    logger.info("✅ ElevenLabs initialized")
    
    yield
    
    # Shutdown
    logger.info("🛑 K-IREA Backend Shutting Down...")
    # Clean up resources if needed


# ============================================================================
# FASTAPI APP INITIALIZATION
# ============================================================================

app = FastAPI(
    title="K-IREA API",
    description="Kenneth's Intelligent Real Estate Agent - API Server",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
frontend_url = os.getenv("FRONTEND_URL", "https://k-irea.com")
admin_url = os.getenv("ADMIN_URL", "http://localhost:3001")
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    frontend_url,
    admin_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin for origin in allowed_origins if origin],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"],
    max_age=3600,
)

# Security: Trusted Hosts
trusted_hosts = [
    host for host in [
        "localhost",
        "127.0.0.1",
        os.getenv("API_HOST"),
        os.getenv("ADMIN_HOST"),
    ]
    if host
]
if trusted_hosts:
    from fastapi.middleware.trustedhost import TrustedHostMiddleware

    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=trusted_hosts,
    )

# Security: Response headers
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
    if "server" in response.headers:
        del response.headers["server"]
    return response

# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================

@app.get("/health")
async def health_check():
    """
    Simple health check endpoint
    Used by load balancers and monitoring
    """
    return {
        "status": "ok",
        "service": "k-irea-api",
        "version": "1.0.0",
    }


@app.get("/api/health")
async def api_health_check():
    """
    Extended health check with dependency checks
    """
    try:
        # Test Supabase connection
        from app.integrations.supabase_client import supabase_client
        response = supabase_client.table("customers").select("id").limit(1).execute()
        db_status = "ok"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "service": "k-irea-api",
        "version": "1.0.0",
        "dependencies": {
            "database": db_status,
            "twilio": "ok",  # TODO: Add actual test
            "elevenlabs": "ok",  # TODO: Add actual test
        }
    }


# ============================================================================
# ROUTE INCLUSIONS
# ============================================================================

# Health check routes
app.include_router(health_router, prefix="/api", tags=["Health"])

# Include all API routers
try:
    from app.routes import (
        auth_router,
        properties_router,
        leads_router,
        users_router,
        agents_router,
        reports_router,
        integrations_router
    )
    from app.routes.integrations_orchestration import router as orchestration_router
    
    app.include_router(auth_router, prefix="/api", tags=["Authentication"])
    app.include_router(properties_router, prefix="/api", tags=["Properties"])
    app.include_router(leads_router, prefix="/api", tags=["Leads"])
    app.include_router(users_router, prefix="/api", tags=["Users"])
    app.include_router(agents_router, prefix="/api", tags=["Agents"])
    app.include_router(reports_router, prefix="/api", tags=["Reports"])
    app.include_router(integrations_router, prefix="/api", tags=["Integrations"])
    app.include_router(orchestration_router, tags=["Orchestration"])
    
    logger.info("✅ All API routers loaded successfully")
except ImportError as e:
    logger.warning(f"⚠️  Some routers could not be loaded: {str(e)}")
    logger.info("   This is normal during development if not all routers are implemented yet")


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status": "error"},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "status": "error"},
    )


# ============================================================================
# STARTUP EVENTS (Alternative to lifespan context)
# ============================================================================

@app.on_event("startup")
async def startup_event():
    logger.info("API server started")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("API server shutdown")


# ============================================================================
# DEBUG MODE (Development only)
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on file changes
        log_level="info",
    )

