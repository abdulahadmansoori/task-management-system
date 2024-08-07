import pytest
from fastapi.testclient import TestClient
from main import app  # Replace with the path to your FastAPI app

client = TestClient(app)

def test_get_comments():
    response = client.get("/comments/")
    assert response.status_code == 200
    assert "comments" in response.json()

def test_get_comment():
    response = client.get("/comments/1")  # Adjust according to your endpoint
    assert response.status_code == 200
    assert "comment" in response.json()

def test_create_comment():
    response = client.post("/comments/", json={"text": "Test Comment", "task_id": 1})
    assert response.status_code == 201
    assert "comment" in response.json()

def test_update_comment():
    response = client.put("/comments/1", json={"text": "Updated Comment"})
    assert response.status_code == 200
    assert "comment" in response.json()

def test_delete_comment():
    response = client.delete("/comments/1")
    assert response.status_code == 204
