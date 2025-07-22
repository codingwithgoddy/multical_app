#!/bin/bash
# Script to run basic smoke tests for the application

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
  if [ "$1" = "PASS" ]; then
    echo -e "${GREEN}✓ PASS${NC}: $2"
  elif [ "$1" = "FAIL" ]; then
    echo -e "${RED}✗ FAIL${NC}: $2"
    FAILED=1
  else
    echo -e "${YELLOW}! INFO${NC}: $2"
  fi
}

# Initialize failure flag
FAILED=0

# Check if backend is running
print_status "INFO" "Checking if backend API is running..."
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/v1/health)
if [ "$BACKEND_RESPONSE" = "200" ]; then
  print_status "PASS" "Backend API is running"
else
  print_status "FAIL" "Backend API is not running or not accessible"
fi

# Check if frontend is running
print_status "INFO" "Checking if frontend is running..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_RESPONSE" = "200" ]; then
  print_status "PASS" "Frontend is running"
else
  print_status "FAIL" "Frontend is not running or not accessible"
fi

# Check if API test page is accessible
print_status "INFO" "Checking if API test page is accessible..."
API_TEST_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api-test)
if [ "$API_TEST_RESPONSE" = "200" ]; then
  print_status "PASS" "API test page is accessible"
else
  print_status "FAIL" "API test page is not accessible"
fi

# Run Python health check script if available
if [ -f "docs/backend-health-check.py" ]; then
  print_status "INFO" "Running backend health check script..."
  if python docs/backend-health-check.py; then
    print_status "PASS" "Backend health check script passed"
  else
    print_status "FAIL" "Backend health check script failed"
  fi
else
  print_status "INFO" "Backend health check script not found, skipping"
fi

# Summary
echo ""
echo "==================================================="
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}All smoke tests passed!${NC}"
  echo "The application appears to be running correctly."
else
  echo -e "${RED}Some smoke tests failed!${NC}"
  echo "Please check the output above for details."
fi
echo "==================================================="

# Exit with appropriate status code
exit $FAILED