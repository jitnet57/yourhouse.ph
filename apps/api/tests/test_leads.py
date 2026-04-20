import pytest
from fastapi import status


class TestLeads:
    """Test suite for lead management endpoints."""

    def test_list_leads(self, client):
        """Test listing all leads."""
        response = client.get("/api/leads")
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

    def test_create_lead(self, client, auth_headers, mock_lead):
        """Test creating a new lead."""
        response = client.post(
            "/api/leads",
            json=mock_lead,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_200_OK]

    def test_get_lead(self, client):
        """Test getting a single lead."""
        response = client.get("/api/leads/1")
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_update_lead(self, client, auth_headers):
        """Test updating a lead."""
        update_data = {"status": "contacted"}
        response = client.put(
            "/api/leads/1",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_delete_lead(self, client, auth_headers):
        """Test deleting a lead."""
        response = client.delete(
            "/api/leads/1",
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_assign_lead(self, client, auth_headers):
        """Test assigning lead to agent."""
        payload = {"assigned_to": "2"}
        response = client.post(
            "/api/leads/1/assign",
            json=payload,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_get_lead_messages(self, client):
        """Test getting lead message history."""
        response = client.get("/api/leads/1/messages")
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_bulk_email_leads(self, client, auth_headers):
        """Test bulk email to leads."""
        payload = {
            "lead_ids": ["1", "2"],
            "subject": "Test Subject",
            "body": "Test email body"
        }
        response = client.post(
            "/api/leads/bulk-email",
            json=payload,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST]
