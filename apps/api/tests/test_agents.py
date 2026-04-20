import pytest
from fastapi import status


class TestAgents:
    """Test suite for AI agent endpoints."""

    def test_list_agents(self, client):
        """Test listing all agents."""
        response = client.get("/api/agents")
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

    def test_create_agent(self, client, auth_headers, mock_agent):
        """Test creating a new agent."""
        response = client.post(
            "/api/agents",
            json=mock_agent,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_200_OK]

    def test_get_agent(self, client):
        """Test getting a single agent."""
        response = client.get("/api/agents/1")
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_get_agent_metrics(self, client):
        """Test getting agent performance metrics."""
        response = client.get("/api/agents/1/metrics")
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_toggle_agent_status(self, client, auth_headers):
        """Test toggling agent on/off."""
        response = client.post(
            "/api/agents/1/toggle-status",
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_test_agent(self, client, auth_headers):
        """Test agent with sample input."""
        payload = {"message": "Hello, how can you help?"}
        response = client.post(
            "/api/agents/1/test",
            json=payload,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_update_agent(self, client, auth_headers):
        """Test updating an agent."""
        update_data = {"name": "Updated Agent"}
        response = client.put(
            "/api/agents/1",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_delete_agent(self, client, auth_headers):
        """Test deleting an agent."""
        response = client.delete(
            "/api/agents/1",
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_get_agent_messages(self, client):
        """Test getting agent message history."""
        response = client.get("/api/agents/1/messages")
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
