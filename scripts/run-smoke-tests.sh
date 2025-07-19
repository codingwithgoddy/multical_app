#!/bin/bash
# Simple smoke test script for staging environment
# This script checks if the main endpoints are responding correctly

# Set variables
BACKEND_URL=${BACKEND_URL:-"https://multiprints-backend-staging.onrender.com"}
ADMIN_URL=${ADMIN_URL:-"https://admin-staging.multiprints.vercel.app"}
CUSTOMER_URL=${CUSTOMER_URL:-"https://customer-staging.multiprints.vercel.app"}

echo "Running smoke tests against staging environment..."
echo "Backend URL: $BACKEND_URL"
echo "Admin URL: $ADMIN_URL"
echo "Customer URL: $CUSTOMER_URL"

# Check backend health endpoint
echo "Checking backend health..."
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health")
if [ "$BACKEND_HEALTH" == "200" ]; then
  echo "✅ Backend health check passed"
else
  echo "❌ Backend health check failed with status $BACKEND_HEALTH"
  FAILED=true
fi

# Check admin frontend
echo "Checking admin frontend..."
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$ADMIN_URL")
if [ "$ADMIN_STATUS" == "200" ]; then
  echo "✅ Admin frontend check passed"
else
  echo "❌ Admin frontend check failed with status $ADMIN_STATUS"
  FAILED=true
fi

# Check customer frontend
echo "Checking customer frontend..."
CUSTOMER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CUSTOMER_URL")
if [ "$CUSTOMER_STATUS" == "200" ]; then
  echo "✅ Customer frontend check passed"
else
  echo "❌ Customer frontend check failed with status $CUSTOMER_STATUS"
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