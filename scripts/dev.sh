#!/bin/bash
# Script to start both frontend and backend development servers

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to start the backend server
start_backend() {
  echo "Starting backend server..."
  cd backend || exit
  
  # Check if virtual environment exists
  if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
  else
    echo "Warning: Virtual environment not found. Using system Python."
  fi
  
  # Check if requirements are installed
  if ! command_exists flask; then
    echo "Installing backend dependencies..."
    pip install -r requirements.txt
  fi
  
  # Start the backend server
  echo "Starting Flask server..."
  python run.py &
  BACKEND_PID=$!
  echo "Backend server started with PID: $BACKEND_PID"
  cd ..
}

# Function to start the frontend server
start_frontend() {
  echo "Starting frontend server..."
  cd frontend || exit
  
  # Check if dependencies are installed
  if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
  fi
  
  # Start the frontend server
  echo "Starting Next.js server..."
  npm run dev &
  FRONTEND_PID=$!
  echo "Frontend server started with PID: $FRONTEND_PID"
  cd ..
}

# Function to handle script termination
cleanup() {
  echo "Shutting down servers..."
  if [ -n "$BACKEND_PID" ]; then
    echo "Stopping backend server (PID: $BACKEND_PID)..."
    kill $BACKEND_PID
  fi
  if [ -n "$FRONTEND_PID" ]; then
    echo "Stopping frontend server (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID
  fi
  exit 0
}

# Set up trap to handle Ctrl+C
trap cleanup INT TERM

# Start servers
start_backend
start_frontend

# Wait a moment for servers to start
sleep 2

# Display information
echo ""
echo "==================================================="
echo "Development servers are running!"
echo "==================================================="
echo "Backend API: http://localhost:5000/api/v1"
echo "Frontend: http://localhost:3000"
echo ""
echo "API Test Page: http://localhost:3000/api-test"
echo ""
echo "Press Ctrl+C to stop both servers."
echo "==================================================="

# Keep script running
wait