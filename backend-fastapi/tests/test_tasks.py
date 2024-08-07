import pytest
from fastapi.testclient import TestClient
from main import app  # Replace with the path to your FastAPI app

client = TestClient(app)

def test_get_tasks():
    response = client.get("/tasks/")
    assert response.status_code == 200
    assert "tasks" in response.json()

def test_get_task():
    response = client.get("/tasks/1")  # Adjust according to your endpoint
    assert response.status_code == 200
    assert "task" in response.json()

def test_create_task():
    response = client.post("/tasks/", json={"title": "Test Task", "description": "Test Description"})
    assert response.status_code == 201
    assert "task" in response.json()

def test_update_task():
    response = client.put("/tasks/1", json={"title": "Updated Task", "description": "Updated Description"})
    assert response.status_code == 200
    assert "task" in response.json()

def test_delete_task():
    response = client.delete("/tasks/1")
    assert response.status_code == 204
