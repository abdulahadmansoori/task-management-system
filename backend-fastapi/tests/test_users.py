import pytest
from fastapi.testclient import TestClient
from main import app  # Replace with the path to your FastAPI app

client = TestClient(app)

def test_get_users():
    response = client.get("/users/")
    assert response.status_code == 200
    assert "users" in response.json()

def test_get_user():
    response = client.get("/users/1")  # Adjust according to your endpoint
    assert response.status_code == 200
    assert "user" in response.json()

def test_create_user():
    response = client.post("/users/", json={"name": "Test User", "email": "test@example.com"})
    assert response.status_code == 201
    assert "user" in response.json()

def test_login():
    response = client.post("/token", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_protected_route():
    token_response = client.post("/token", data={"username": "testuser", "password": "testpassword"})
    token = token_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/protected-endpoint", headers=headers)  # Adjust according to your endpoint
    assert response.status_code == 200
