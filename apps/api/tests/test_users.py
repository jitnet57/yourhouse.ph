import pytest
from fastapi import status


class TestUsers:
    """Test suite for user management endpoints."""

    def test_list_users(self, client, auth_headers):
        """Test listing all users."""
        response = client.get("/api/users", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

    def test_create_user(self, client, auth_headers, mock_user):
        """Test creating a new user."""
        response = client.post(
            "/api/users",
            json=mock_user,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_200_OK]

    def test_get_user(self, client, auth_headers):
        """Test getting a single user."""
        response = client.get("/api/users/1", headers=auth_headers)
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_update_user(self, client, auth_headers):
        """Test updating a user."""
        update_data = {"name": "Updated Name"}
        response = client.put(
            "/api/users/1",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_delete_user(self, client, auth_headers):
        """Test deleting a user."""
        response = client.delete(
            "/api/users/1",
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_deactivate_user(self, client, auth_headers):
        """Test deactivating a user."""
        response = client.post(
            "/api/users/1/deactivate",
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_activate_user(self, client, auth_headers):
        """Test activating a user."""
        response = client.post(
            "/api/users/1/activate",
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_change_user_role(self, client, auth_headers):
        """Test changing user role."""
        payload = {"role": "manager"}
        response = client.post(
            "/api/users/1/change-role",
            json=payload,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_get_user_permissions(self, client, auth_headers):
        """Test getting user permissions."""
        response = client.get(
            "/api/users/1/permissions",
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_get_role_permissions(self, client, auth_headers):
        """Test getting role permissions."""
        response = client.get(
            "/api/users/role/admin/permissions",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK

    def test_user_statistics(self, client, auth_headers):
        """Test getting user statistics."""
        response = client.get(
            "/api/users/statistics/summary",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
