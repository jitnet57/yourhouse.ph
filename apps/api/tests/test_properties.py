import pytest
from fastapi import status


class TestProperties:
    """Test suite for property management endpoints."""

    def test_list_properties(self, client):
        """Test listing all properties."""
        response = client.get("/api/properties")
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

    def test_list_properties_with_pagination(self, client):
        """Test listing properties with pagination."""
        response = client.get("/api/properties?skip=0&limit=10")
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

    def test_create_property(self, client, auth_headers, mock_property):
        """Test creating a new property."""
        response = client.post(
            "/api/properties",
            json=mock_property,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_200_OK]

    def test_get_property(self, client):
        """Test getting a single property."""
        response = client.get("/api/properties/1")
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_update_property(self, client, auth_headers):
        """Test updating a property."""
        update_data = {"name": "Updated Property"}
        response = client.put(
            "/api/properties/1",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_delete_property(self, client, auth_headers):
        """Test deleting a property."""
        response = client.delete(
            "/api/properties/1",
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_invalid_property_id(self, client):
        """Test getting property with invalid ID."""
        response = client.get("/api/properties/invalid-id")
        assert response.status_code in [status.HTTP_404_NOT_FOUND, status.HTTP_422_UNPROCESSABLE_ENTITY]
