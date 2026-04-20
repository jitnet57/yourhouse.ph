import pytest
from fastapi.testclient import TestClient
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main_updated import app


@pytest.fixture
def client():
    """Create test client for API testing."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def auth_headers():
    """Provide authorization headers for authenticated requests."""
    return {"Authorization": "Bearer test_access_token"}


@pytest.fixture
def mock_user():
    """Provide mock user data for tests."""
    return {
        "id": "1",
        "name": "Test User",
        "email": "test@test.com",
        "phone": "+63 9171234567",
        "role": "admin",
        "is_active": True,
    }


@pytest.fixture
def mock_property():
    """Provide mock property data for tests."""
    return {
        "name": "Test Property",
        "location": "Metro Manila",
        "price": "₱ 5,000,000",
        "bedrooms": 3,
        "bathrooms": 2,
        "status": "available",
        "agent_id": "1",
    }


@pytest.fixture
def mock_lead():
    """Provide mock lead data for tests."""
    return {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+63 9171234567",
        "property_interested": "Test Property",
        "status": "new",
        "assigned_to": None,
    }


@pytest.fixture
def mock_agent():
    """Provide mock agent data for tests."""
    return {
        "name": "AI Agent 1",
        "status": "active",
        "model": "gpt-4-turbo",
        "temperature": 0.7,
        "max_tokens": 2000,
        "system_prompt": "You are a helpful real estate assistant.",
    }
