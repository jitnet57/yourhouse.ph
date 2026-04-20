from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)

# Models
class UserCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    role: str = "agent"  # admin, manager, agent, viewer

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None

class User(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    created_at: str
    updated_at: str
    last_login: Optional[str] = None

class RolePermission(BaseModel):
    role: str
    can_manage_users: bool
    can_manage_properties: bool
    can_manage_leads: bool
    can_access_reports: bool
    can_configure_agents: bool
    can_view_analytics: bool

# In-memory storage (replace with database)
users_db = {
    "1": {
        "id": "1",
        "name": "John Administrator",
        "email": "john.admin@yourhouse.ph",
        "phone": "+63 9171234567",
        "role": "admin",
        "is_active": True,
        "created_at": "2026-01-15",
        "updated_at": "2026-04-17",
        "last_login": "2026-04-17"
    },
    "2": {
        "id": "2",
        "name": "Maria Manager",
        "email": "maria.manager@yourhouse.ph",
        "phone": "+63 9187654321",
        "role": "manager",
        "is_active": True,
        "created_at": "2026-02-01",
        "updated_at": "2026-04-17",
        "last_login": "2026-04-17"
    }
}

ROLE_PERMISSIONS = {
    "admin": RolePermission(
        role="admin",
        can_manage_users=True,
        can_manage_properties=True,
        can_manage_leads=True,
        can_access_reports=True,
        can_configure_agents=True,
        can_view_analytics=True
    ),
    "manager": RolePermission(
        role="manager",
        can_manage_users=False,
        can_manage_properties=True,
        can_manage_leads=True,
        can_access_reports=True,
        can_configure_agents=False,
        can_view_analytics=True
    ),
    "agent": RolePermission(
        role="agent",
        can_manage_users=False,
        can_manage_properties=False,
        can_manage_leads=True,
        can_access_reports=False,
        can_configure_agents=False,
        can_view_analytics=False
    ),
    "viewer": RolePermission(
        role="viewer",
        can_manage_users=False,
        can_manage_properties=False,
        can_manage_leads=False,
        can_access_reports=True,
        can_configure_agents=False,
        can_view_analytics=True
    )
}

# Endpoints

@router.get("/", response_model=List[User])
async def list_users(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100)):
    """Get all users with pagination"""
    users_list = list(users_db.values())
    return users_list[skip:skip + limit]

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get specific user details"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]

@router.post("/", response_model=User)
async def create_user(user: UserCreate):
    """Create a new user"""
    # Check if email already exists
    if any(u["email"] == user.email for u in users_db.values()):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user_id = str(len(users_db) + 1)
    now = datetime.now().isoformat().split("T")[0]
    
    new_user = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
        "last_login": None
    }
    users_db[user_id] = new_user
    return new_user

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: str, user: UserUpdate):
    """Update user information"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    existing_user = users_db[user_id]
    
    # Check if new email already exists
    if user.email and user.email != existing_user["email"]:
        if any(u["email"] == user.email for u in users_db.values()):
            raise HTTPException(status_code=400, detail="Email already exists")
    
    # Update fields
    if user.name:
        existing_user["name"] = user.name
    if user.email:
        existing_user["email"] = user.email
    if user.phone:
        existing_user["phone"] = user.phone
    if user.role:
        if user.role not in ROLE_PERMISSIONS:
            raise HTTPException(status_code=400, detail="Invalid role")
        existing_user["role"] = user.role
    
    existing_user["updated_at"] = datetime.now().isoformat().split("T")[0]
    return existing_user

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """Delete a user"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    del users_db[user_id]
    return {"message": "User deleted successfully"}

@router.post("/{user_id}/deactivate")
async def deactivate_user(user_id: str):
    """Deactivate a user account"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    users_db[user_id]["is_active"] = False
    return {"user_id": user_id, "is_active": False}

@router.post("/{user_id}/activate")
async def activate_user(user_id: str):
    """Activate a user account"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    users_db[user_id]["is_active"] = True
    return {"user_id": user_id, "is_active": True}

@router.get("/{user_id}/permissions", response_model=RolePermission)
async def get_user_permissions(user_id: str):
    """Get permissions for a user based on their role"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    role = user["role"]
    
    if role not in ROLE_PERMISSIONS:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    return ROLE_PERMISSIONS[role]

@router.get("/role/{role_name}", response_model=RolePermission)
async def get_role_permissions(role_name: str):
    """Get permissions for a specific role"""
    if role_name not in ROLE_PERMISSIONS:
        raise HTTPException(status_code=404, detail="Role not found")
    
    return ROLE_PERMISSIONS[role_name]

@router.post("/{user_id}/change-role")
async def change_user_role(user_id: str, new_role: str):
    """Change user role"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    if new_role not in ROLE_PERMISSIONS:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    users_db[user_id]["role"] = new_role
    users_db[user_id]["updated_at"] = datetime.now().isoformat().split("T")[0]
    return users_db[user_id]

@router.post("/{user_id}/last-login")
async def update_last_login(user_id: str):
    """Update user's last login timestamp"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    now = datetime.now().isoformat().split("T")[0]
    users_db[user_id]["last_login"] = now
    return {"user_id": user_id, "last_login": now}

@router.get("/statistics/summary")
async def get_user_statistics():
    """Get user account statistics"""
    total = len(users_db)
    active = sum(1 for u in users_db.values() if u["is_active"])
    inactive = total - active
    
    role_counts = {}
    for user in users_db.values():
        role = user["role"]
        role_counts[role] = role_counts.get(role, 0) + 1
    
    return {
        "total_users": total,
        "active_users": active,
        "inactive_users": inactive,
        "by_role": role_counts
    }

@router.post("/bulk/change-role")
async def bulk_change_role(user_ids: List[str], new_role: str):
    """Change role for multiple users"""
    if new_role not in ROLE_PERMISSIONS:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    updated_count = 0
    for user_id in user_ids:
        if user_id in users_db:
            users_db[user_id]["role"] = new_role
            users_db[user_id]["updated_at"] = datetime.now().isoformat().split("T")[0]
            updated_count += 1
    
    return {"updated_count": updated_count, "total_requested": len(user_ids)}
