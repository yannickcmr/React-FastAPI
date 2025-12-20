import pytest 
from fastapi import status, testclient
from app.api import app


""" Testing """

@pytest.fixture
def client():
    """ Generate Test Client """
    return testclient.TestClient(app)

class TestRootEndpoint:
    """ Unit Test for Root Endpoint """

    def test_get_root(self, client) -> None:
        """ Testing GET / endpoint """
        response = client.get("/")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert data['code'] == 200
        assert data['data'] is None
        assert isinstance(data['msg'], str)

    def test_get_ping(self, client) -> None:
        """ Testing GET /ping endpoint """
        response = client.get("/ping")

        assert response.status_code == status.HTTP_200_OK
        assert response.json() == "pong"

    def test_api_docs(self, client) -> None:
        """ Testing GET /docs endpoint """
        response = client.get("/docs")
        assert response.status_code == status.HTTP_200_OK
        assert "text/html" in response.headers["content-type"]
