"""
Test routes module.
This module tests the application routes.
"""

def test_health_endpoint(client):
    """Test the health endpoint."""
    response = client.get('/api/v1/health')
    assert response.status_code == 200
    assert response.json['status'] == 'ok'

def test_index_endpoint(client):
    """Test the index endpoint."""
    response = client.get('/api/v1/')
    assert response.status_code == 200
    assert 'message' in response.json
    assert 'version' in response.json
    assert 'endpoints' in response.json