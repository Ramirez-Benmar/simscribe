#!/bin/bash

echo "========================================"
echo "Starting Simscribe Transcription App"
echo "========================================"
echo ""

# Check if backend virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "[Setup] Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

echo "[1/2] Starting Backend Server..."
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
cd ..

echo "[2/2] Starting Frontend Server..."
cd frontend-app
if [ ! -d "node_modules" ]; then
    echo "[Setup] Installing npm dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "Both servers are running!"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://127.0.0.1:8000"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
