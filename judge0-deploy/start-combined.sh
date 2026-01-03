#!/bin/bash
set -e

echo "Starting Judge0 Combined (Server + Workers)..."

# Start workers in background
echo "Starting workers..."
cd /api && ./scripts/workers &
WORKERS_PID=$!

# Start server in foreground
echo "Starting server..."
cd /api && ./scripts/server &
SERVER_PID=$!

# Function to handle shutdown
shutdown() {
    echo "Shutting down..."
    kill -TERM $SERVER_PID 2>/dev/null || true
    kill -TERM $WORKERS_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
    wait $WORKERS_PID 2>/dev/null || true
    exit 0
}

# Trap signals
trap shutdown SIGTERM SIGINT

# Wait for both processes
wait $SERVER_PID
