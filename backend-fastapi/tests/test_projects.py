import pytest
from fastapi.testclient import TestClient
from main import app  # Replace with the path to your FastAPI app

client = TestClient(app)

def test_get_projects():
    response = client.get("/projects/")
    assert response.status_code == 200
    assert "projects" in response.json()

def test_get_project():
    response = client.get("/projects/1")  # Adjust according to your endpoint
    assert response.status_code == 200
    assert "project" in response.json()

def test_create_project():
    response = client.post("/projects/", json={"name": "Test Project", "description": "Test Description"})
    assert response.status_code == 201
    assert "project" in response.json()

def test_update_project():
    response = client.put("/projects/1", json={"name": "Updated Project", "description": "Updated Description"})
    assert response.status_code == 200
    assert "project" in response.json()

def test_delete_project():
    response = client.delete("/projects/1")
    assert response.status_code == 204
