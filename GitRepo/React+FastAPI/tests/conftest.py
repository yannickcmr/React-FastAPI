import pytest
from fastapi.testclient import TestClient
from app.api import app


""" Test """

@pytest.fixture
def client():
    """ Generate Test Client """
    return TestClient(app)
