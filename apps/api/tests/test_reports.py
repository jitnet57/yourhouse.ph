import pytest
from fastapi import status


class TestReports:
    """Test suite for reporting endpoints."""

    def test_list_reports(self, client, auth_headers):
        """Test listing all reports."""
        response = client.get("/api/reports", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

    def test_create_report(self, client, auth_headers):
        """Test creating a new report."""
        payload = {
            "name": "Weekly Report",
            "report_type": "leads",
            "format": "pdf"
        }
        response = client.post(
            "/api/reports",
            json=payload,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_200_OK]

    def test_get_report(self, client, auth_headers):
        """Test getting a single report."""
        response = client.get("/api/reports/1", headers=auth_headers)
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_update_report(self, client, auth_headers):
        """Test updating a report."""
        update_data = {"name": "Updated Report"}
        response = client.put(
            "/api/reports/1",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_delete_report(self, client, auth_headers):
        """Test deleting a report."""
        response = client.delete(
            "/api/reports/1",
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_generate_report(self, client, auth_headers):
        """Test generating a report."""
        response = client.post(
            "/api/reports/1/generate",
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_export_report(self, client, auth_headers):
        """Test exporting a report."""
        payload = {"format": "pdf"}
        response = client.post(
            "/api/reports/1/export",
            json=payload,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_schedule_report(self, client, auth_headers):
        """Test scheduling a report."""
        payload = {"frequency": "weekly"}
        response = client.post(
            "/api/reports/1/schedule",
            json=payload,
            headers=auth_headers
        )
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_get_report_statistics(self, client, auth_headers):
        """Test getting report statistics."""
        response = client.get(
            "/api/reports/statistics/summary",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
