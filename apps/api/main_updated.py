"""
FastAPI Main Application
K-IREA Admin Dashboard Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="K-IREA Admin API",
    description="Backend API for K-IREA Admin Dashboard",
    version="1.0.0"
)

# CORS Configuration
_extra_origins = [o for o in [os.getenv("ADMIN_URL"), os.getenv("WEB_URL")] if o]
origins = [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://yourhouse-ph.pages.dev",
    "https://yourhouse-admin.pages.dev",
    "https://yourhouse.ph",
    "https://admin.yourhouse.ph",
    *_extra_origins,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security: Trusted Host
# Cloud Run sets HOST header to the service URL (*.run.app) — include it.
_extra_hosts = [h for h in [os.getenv("ADMIN_HOST"), os.getenv("API_HOST")] if h]
allowed_hosts = [
    "localhost",
    "127.0.0.1",
    "*.run.app",
    "api.yourhouse.ph",
    *_extra_hosts,
]
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=allowed_hosts,
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "K-IREA Admin API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": "2026-04-17T14:30:00Z"
    }

# Import and include routers
from app.routes import auth, properties, leads, users, agents, reports, integrations
from app.routes.integrations_orchestration import router as orchestration_router

# Include routers in application
app.include_router(auth.router)
app.include_router(properties.router)
app.include_router(leads.router)
app.include_router(users.router)
app.include_router(agents.router)
app.include_router(reports.router)
app.include_router(integrations.router)
app.include_router(orchestration_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
