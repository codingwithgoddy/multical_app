#!/bin/bash
# Simple smoke test script for staging environment
# This script checks if the main endpoints are responding correctly

# Set variables
BACKEND_URL=${BACKEND_URL:-"https://multiprints-backend-staging.onrender.com"}
FRONTEND_URL=${FRONTEND_URL:-"https://multiprints-staging.vercel.app"}

echo "Running smoke tests against staging environment..."
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"

# Check backend health endpoint
echo "Checking backend health..."
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health")
if [ "$BACKEND_HEALTH" == "200" ]; then
  echo "✅ Backend health check passed"
else
  echo "❌ Backend health check failed with status $BACKEND_HEALTH"
  FAILED=true
fi

# Check frontend (customer website)
echo "Checking frontend (customer website)..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$FRONTEND_STATUS" == "200" ]; then
  echo "✅ Frontend (customer website) check passed"
else
  echo "❌ Frontend (customer website) check failed with status $FRONTEND_STATUS"
  FAILED=true
fi

# Check admin dashboard
echo "Checking admin dashboard..."
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/admin")
if [ "$ADMIN_STATUS" == "200" ]; then
  echo "✅ Admin dashboard check passed"
else
  echo "❌ Admin dashboard check failed with status $ADMIN_STATUS"
  FAILED=true
fi

# Summary
echo ""
echo "Smoke test summary:"
if [ "$FAILED" == "true" ]; then
  echo "❌ Some tests failed"
  exit 1
else
  echo "✅ All tests passed"
  exit 0
fi