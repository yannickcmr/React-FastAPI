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
    def test_online_initialize(self, client):
        """Testing POST /online_facility_location endpoint"""
        payload = {
            "demand": {"demandID": 1, "location": [0, 0]},
            "demands": [],
            "facilities": [],
            "parameter": {
                "probability": 1.0,
                "openingCosts": 10.0,
                "costs": 1,
                "metric": "euclidean"
            }
        }
        response = client.post("/online_facility_location", json=payload)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "msg" in data
        assert "code" in data
        assert "data" in data

        assert data["code"] == 200
        data = data['data']

        assert data['data']['coin']
        assert data['data']['costs']['current'] == 10
        assert data['data']['costs']['previous'] == 0
        assert data['data']['costs']['delta'] == 10

        assert len(data['demands']) == 1
        assert len(data['facilities']) == 1

    def test_online_open_facility(self, client):
        """Testing POST /online_facility_location endpoint"""
        payload = {
            "demand": {"demandID": 2, "location": [10, -10]},
            "demands": [{"demandID": 1, "location": [0, 0]}],
            "facilities": [{"facilityID": 0, "location": [0, 0], "connection": [1], "openingCosts": 10.0}],
            "parameter": {
                "probability": 1.0,
                "openingCosts": 0.0,
                "costs": 10,
                "metric": "euclidean"
            }
        }
        response = client.post("/online_facility_location", json=payload)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "msg" in data
        assert "code" in data
        assert "data" in data

        assert data["code"] == 200
        data = data['data']

        assert data['data']['coin']
        assert data['data']['costs']['current'] == 10
        assert data['data']['costs']['previous'] == 10
        assert data['data']['costs']['delta'] == 0

        assert len(data['demands']) == 2
        assert len(data['facilities']) == 2

    def test_online_assign_demand(self, client):
        """Testing POST /online_facility_location endpoint"""
        payload = {
            "demand": {"demandID": 2, "location": [3, 4]},
            "demands": [{"demandID": 1, "location": [0, 0]}],
            "facilities": [{"facilityID": 0, "location": [0, 0], "connection": [1], "openingCosts": 10.0}],
            "parameter": {
                "probability": 1.0,
                "openingCosts": 1000000.0,
                "costs": 10,
                "metric": "euclidean"
            }
        }
        response = client.post("/online_facility_location", json=payload)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "msg" in data
        assert "code" in data
        assert "data" in data

        assert data["code"] == 200
        data = data['data']

        assert data['data']['coin']
        assert data['data']['costs']['current'] == 15
        assert data['data']['costs']['previous'] == 10
        assert data['data']['costs']['delta'] == 5

        assert len(data['demands']) == 2
        assert len(data['facilities']) == 1

    def test_offline_relocation(self, client):
        """Testing POST /offline_facility_location endpoint"""
        payload = {
            "demands": [{"demandID": 1, "location": [0, 0]}, {"demandID": 2, "location": [10, -10]}],
            "facilities": [{"facilityID": 0, "location": [0, 0], "connection": [1, 2], "openingCosts": 10.0}],
            "parameter": {
                "iterations": 10,
                "openingCosts": 10.0,
                "costs": 10,
                "metric": "euclidean"
            }
        }
        response = client.post("/offline_facility_location", json=payload)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "msg" in data
        assert "code" in data
        assert "data" in data

        assert data["code"] == 200
        data = data['data']

        assert data['data']['coin']
        assert data['data']['costs']['current'] <= 24.5
        assert data['data']['costs']['previous'] <= 24.5
        assert data['data']['costs']['delta'] == 0

        assert len(data['demands']) == 2
        assert len(data['facilities']) == 1
