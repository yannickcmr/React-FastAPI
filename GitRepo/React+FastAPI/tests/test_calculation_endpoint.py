import pytest
from fastapi import status
from fastapi.testclient import TestClient
from app.api import app


""" Test """

@pytest.fixture
def client():
    """ Generate Test Client """
    return TestClient(app)

class TestFacilityLocationEndpoint:
    """Unit Test for DB Endpoint"""
    def test_check_db(self, client):
        """Testing GET /check_db endpoint"""
        response = client.get("/check_db")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "msg" in data
        assert "code" in data
        assert data["code"] == 200

    def test_get_user(self, client):
        """Testing POST /get_user endpoint"""
        payload = {
            'userID': 1,
            'email': None,
            'phone': None
        }
        response = client.post("/get_user", json=payload)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "msg" in data
        assert "code" in data
        assert "data" in data
        assert data["code"] == 200
    
    def test_add_user(self, client):
        """Testing POST /add_user endpoint"""
        payload = {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone': '1234567890',
            'birthday': '01.01.2000',
            'address': {'street': "main street", 'number': '12'}
        }
        response = client.post("/add_user", json=payload)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "msg" in data
        assert "code" in data
        assert "data" in data
        assert data["code"] == 200
    
    def test_delete_user(self, client):
        """Testing POST /delete_user endpoint"""
        payload = {
            'userID': 1,
            'email': None,
            'phone': None
        }
        response = client.post("/delete_user", json=payload)  # Fixed endpoint name
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "msg" in data
        assert "code" in data
        assert data["code"] == 200
