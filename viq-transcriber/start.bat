@echo off
cd /d "%~dp0"

echo ========================================
echo Starting Simscribe Transcription App
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Backend" cmd /k "cd /d "%~dp0backend" && uvicorn main:app --reload --host 127.0.0.1 --port 8000"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Server...
start "Frontend" cmd /k "cd /d "%~dp0frontend-app" && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo Frontend: http://localhost:5173
echo Backend:  http://127.0.0.1:8000
echo ========================================
echo.
echo Close the terminal windows to stop the servers.
echo.
