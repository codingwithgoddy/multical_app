#!/bin/bash
# Script to run both backend and frontend for local development

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "tmux is not installed. Please install it or run the backend and frontend separately."
    echo "Backend: cd backend && flask run"
    echo "Frontend: cd frontend && npm run dev"
    exit 1
fi

# Create a new tmux session
tmux new-session -d -s multiprints

# Split the window horizontally
tmux split-window -h -t multiprints

# Run backend in the left pane
tmux send-keys -t multiprints:0.0 "cd backend && source venv/bin/activate && flask run" C-m

# Run frontend in the right pane
tmux send-keys -t multiprints:0.1 "cd frontend && npm run dev" C-m

# Attach to the session
tmux attach-session -t multiprints