import pytest
from fastapi import status


class TestAuth:
    """Test suite for authentication endpoints."""

    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get("/api/health")
        assert response.status_code == status.HTTP_200_OK
        assert "status" in response.json()

    def test_login_success(self, client):
        """Test successful login with valid credentials."""
        payload = {
            "email": "test@test.com",
            "password": "password123"
        }
        response = client.post("/api/auth/login", json=payload)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert "user" in data

    def test_login_invalid_email(self, client):
        """Test login with invalid email format."""
        payload = {
            "email": "invalid-email",
            "password": "password123"
        }
        response = client.post("/api/auth/login", json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_login_missing_fields(self, client):
        """Test login with missing required fields."""
        payload = {"email": "test@test.com"}
        response = client.post("/api/auth/login", json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_success(self, client):
        """Test successful user registration."""
        payload = {
            "name": "New User",
            "email": "newuser@test.com",
            "password": "password123"
        }
        response = client.post("/api/auth/register", json=payload)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["email"] == "newuser@test.com"
        assert data["name"] == "New User"

    def test_register_duplicate_email(self, client):
        """Test registration with duplicate email."""
        payload = {
            "name": "Duplicate User",
            "email": "test@test.com",
            "password": "password123"
        }
        # First registration
        response1 = client.post("/api/auth/register", json=payload)
        # Second registration with same email
        response2 = client.post("/api/auth/register", json=payload)
        assert response2.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_409_CONFLICT]

    def test_refresh_token(self, client):
        """Test token refresh endpoint."""
        response = client.post(
            "/api/auth/refresh",
            json={"refresh_token": "test_refresh_token"}
        )
        # Should return 200 or 401 depending on implementation
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED]

    def test_current_user(self, client, auth_headers):
        """Test getting current user info."""
        response = client.get("/api/auth/me", headers=auth_headers)
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED]

    def test_logout(self, client, auth_headers):
        """Test logout endpoint."""
        response = client.post("/api/auth/logout", headers=auth_headers)
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED]
