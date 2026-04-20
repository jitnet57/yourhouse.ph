"""
Authentication Routes - FastAPI
"""
from fastapi import APIRouter, HTTPException, Depends, status, Header
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.middleware.jwt import (
    create_tokens,
    verify_password,
    get_password_hash,
    verify_token,
    decode_token,
    TokenResponse
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Mock user database (TODO: Replace with actual database)
users_db = {
    "1": {
        "id": "1",
        "email": "admin@test.com",
        "name": "Admin User",
        "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lm",  # password123
        "role": "admin",
        "is_active": True
    }
}

# Pydantic Models
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    is_active: bool

# Helper functions
def find_user_by_email(email: str):
    """Find user by email in mock database."""
    for user in users_db.values():
        if user["email"] == email:
            return user
    return None

def authenticate_user(email: str, password: str):
    """Authenticate user with email and password."""
    user = find_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    return user

def get_current_user(authorization: Optional[str] = Header(None)):
    """Extract and verify current user from JWT token."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )

    token_data = verify_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user = find_user_by_email(token_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

# Routes
@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    """User login endpoint."""
    user = authenticate_user(user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    tokens = create_tokens(user["id"], user["email"])
    return tokens

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """User registration endpoint."""
    if find_user_by_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    new_user = {
        "id": str(len(users_db) + 1),
        "email": user_data.email,
        "name": user_data.name,
        "password_hash": get_password_hash(user_data.password),
        "role": "viewer",
        "is_active": True
    }

    users_db[new_user["id"]] = new_user

    return {
        "id": new_user["id"],
        "email": new_user["email"],
        "name": new_user["name"],
        "role": new_user["role"],
        "is_active": new_user["is_active"]
    }

@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(request: RefreshTokenRequest):
    """Refresh access token using refresh token."""
    payload = decode_token(request.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    email = payload.get("sub")
    user = find_user_by_email(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    tokens = create_tokens(user["id"], user["email"])
    return tokens

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user info."""
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user["name"],
        "role": current_user["role"],
        "is_active": current_user["is_active"]
    }

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """User logout (token blacklist would be implemented in production)."""
    return {"message": "Logged out successfully"}
