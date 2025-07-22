#!/usr/bin/env python3
"""
Simple script to check if the backend API is running and accessible.
"""
import requests
import sys
import json
from urllib.parse import urljoin

def check_backend_health(base_url):
    """Check if the backend API is running and accessible."""
    try:
        # Check health endpoint
        health_url = urljoin(base_url, '/api/v1/health')
        print(f"Checking health endpoint: {health_url}")
        
        health_response = requests.get(health_url, timeout=5)
        health_response.raise_for_status()
        
        print("✅ Health check successful!")
        print(f"Status code: {health_response.status_code}")
        print(f"Response: {json.dumps(health_response.json(), indent=2)}")
        
        # Check API root endpoint
        root_url = urljoin(base_url, '/api/v1/')
        print(f"\nChecking API root endpoint: {root_url}")
        
        root_response = requests.get(root_url, timeout=5)
        root_response.raise_for_status()
        
        print("✅ API root check successful!")
        print(f"Status code: {root_response.status_code}")
        print(f"Response: {json.dumps(root_response.json(), indent=2)}")
        
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Could not connect to the backend API.")
        print("Make sure the backend server is running and accessible.")
        return False
    except requests.exceptions.Timeout:
        print("❌ Timeout error: The backend API took too long to respond.")
        return False
    except requests.exceptions.HTTPError as e:
        print(f"❌ HTTP error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    # Default backend URL
    backend_url = "http://localhost:5000"
    
    # Check if a custom URL was provided
    if len(sys.argv) > 1:
        backend_url = sys.argv[1]
    
    print(f"Testing backend API at: {backend_url}")
    
    if check_backend_health(backend_url):
        print("\n✅ Backend API is running and accessible!")
        sys.exit(0)
    else:
        print("\n❌ Backend API check failed!")
        sys.exit(1)